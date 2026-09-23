
import { useEffect } from 'react';
import { calculateStatus } from '../utils/helpers';

export function useNotifications(items, currentKm) {
  useEffect(() => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if (Notification.permission === 'granted' && items.length > 0) {
      const criticalItems = items.filter(
        (i) => calculateStatus(i, currentKm).status === 'CRITICAL'
      );

      if (criticalItems.length > 0) {
        new Notification('🚗 AutoCare - Atenção Necessária!', {
          body: `Você possui ${criticalItems.length} componente(s) vencido(s) precisando de manutenção.`,
          icon: '/favicon.ico',
        });
      }
    }
  }, [items, currentKm]);
}