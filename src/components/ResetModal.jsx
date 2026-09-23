import React, { useState } from 'react';
import { X, DollarSign, Wrench } from 'lucide-react';

export function ResetModal({ isOpen, onClose, item, currentKm, onConfirm }) {
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(item, {
      cost: Number(cost) || 0,
      notes: notes.trim(),
      km: currentKm,
      date: new Date().toISOString().split('T')[0],
      itemName: item.name,
    });
    setCost('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-500" />
            Renovar: {item.name}
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Custo do Serviço / Peça (R$)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">R$</span>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Observações / Oficina (Opcional)</label>
            <textarea
              rows="2"
              placeholder="Ex: Marca da peça, nome da oficina..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 text-[11px] text-slate-400">
            A troca será registrada na KM atual (<strong className="text-amber-400 font-mono">{Number(currentKm).toLocaleString()} km</strong>) na data de hoje.
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2.5 rounded-xl transition text-xs shadow-lg shadow-amber-500/10"
          >
            Confirmar Renovação & Salvar Histórico
          </button>
        </form>
      </div>
    </div>
  );
}