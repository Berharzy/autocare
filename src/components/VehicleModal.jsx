import React, { useState } from 'react';
import { X } from 'lucide-react';

export function VehicleModal({ isOpen, onClose, vehicle, onSave }) {
  const [data, setData] = useState({
    model: vehicle?.model || '',
    year: vehicle?.year || '',
    licensePlate: vehicle?.licensePlate || ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-slate-100">Dados do Veículo</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Modelo do Carro</label>
            <input 
              type="text" 
              placeholder="Ex: Golf 1.4 TSI / Onix 1.0"
              value={data.model}
              onChange={e => setData({ ...data, model: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Ano</label>
              <input 
                type="text" 
                placeholder="2020"
                value={data.year}
                onChange={e => setData({ ...data, year: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Placa</label>
              <input 
                type="text" 
                placeholder="ABC-1234"
                value={data.licensePlate}
                onChange={e => setData({ ...data, licensePlate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2.5 rounded-xl transition text-xs"
          >
            Atualizar Veículo
          </button>
        </form>
      </div>
    </div>
  );
}