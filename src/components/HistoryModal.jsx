import React from 'react';
import { X, History, DollarSign, Calendar, Gauge } from 'lucide-react';

export function HistoryModal({ isOpen, onClose, history = [] }) {
  if (!isOpen) return null;

  const totalSpent = history.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-slate-100">Histórico de Manutenções</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total do Investimento */}
        <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">TOTAL INVESTIDO EM MANUTENÇÃO</span>
          <span className="text-lg font-bold font-mono text-emerald-400">
            R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Lista de Registros */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <p className="text-center text-slate-500 text-xs py-8">Nenhum registro de manutenção no histórico ainda.</p>
          ) : (
            history.slice().reverse().map((entry, idx) => (
              <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-100">{entry.itemName}</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    R$ {Number(entry.cost || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {entry.date}</span>
                  <span className="flex items-center gap-1 font-mono"><Gauge className="w-3 h-3" /> {Number(entry.km).toLocaleString()} km</span>
                </div>
                {entry.notes && (
                  <p className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-700/40 mt-1">
                    "{entry.notes}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}