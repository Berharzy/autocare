import React from 'react';
import { Wrench, LogOut, Car } from 'lucide-react';
import { auth, signOut } from '../services/firebase';

export function Navbar({ user, vehicle, onOpenVehicleModal }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-tight text-white">AutoCare</h1>
            <p className="text-xs text-slate-400">Manutenção Automotiva</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenVehicleModal}
              className="hidden sm:flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 transition"
            >
              <Car className="w-4 h-4 text-amber-500" />
              <span>{vehicle.model ? `${vehicle.model} (${vehicle.year || ''})` : 'Configurar Veículo'}</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700" 
              />
              <button 
                onClick={() => signOut(auth)} 
                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}