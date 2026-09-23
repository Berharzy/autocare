import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Verifica se o e-mail do usuário está na whitelist (allowed_users)
          const allowedDocRef = doc(db, 'allowed_users', currentUser.email);
          const allowedSnap = await getDoc(allowedDocRef);

          if (allowedSnap.exists()) {
            setUser(currentUser);
            setAccessDenied(false);
          } else {
            // E-mail não autorizado: desconecta o usuário imediatamente
            await signOut(auth);
            setUser(null);
            setAccessDenied(true);
          }
        } catch (error) {
          console.error("Erro ao verificar permissão:", error);
          await signOut(auth);
          setUser(null);
          setAccessDenied(true);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, accessDenied };
}