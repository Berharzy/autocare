import React from 'react';
import { Calendar, Gauge, RefreshCw, Trash2 } from 'lucide-react';
import { calculateStatus } from '../utils/helpers';

export function ItemCard({ item, currentKm, onReset, onDelete }) {
  const statusInfo = calculateStatus(item, currentKm);

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-600 transition group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-700/50 px-2 py-0.5 rounded-full border border-slate-600/30">
              {item.category || 'Geral'}
            </span>
            <h3 className="font-semibold text-slate-100 text-base mt-1">{item.name}</h3>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium whitespace-nowrap ${statusInfo.badge}`}>
            {statusInfo.status === 'CRITICAL' ? 'Atenção Crítica' : statusInfo.status === 'WARNING' ? 'Troca Próxima' : 'Em Dia'}
          </span>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full bg-slate-700/50 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${statusInfo.bar}`} 
            style={{ width: `${statusInfo.percentage}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
          <div>
            <span className="text-slate-500 block text-[10px]">ÚLTIMA TROCA</span>
            <span className="font-mono">{Number(item.lastKm).toLocaleString()} km</span>
            <span className="text-slate-400 block text-[10px] mt-0.5">{item.lastDate || 'S/ Data'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">INTERVALO</span>
            <span className="font-mono">+{Number(item.intervalKm).toLocaleString()} km</span>
            <span className="text-slate-400 block text-[10px] mt-0.5">+{item.intervalMonths} meses</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px] truncate max-w-[180px]">{statusInfo.message}</span>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onReset(item)} 
            className="flex items-center gap-1 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-lg border border-amber-500/20 font-medium transition"
            title="Registrar nova troca hoje com a KM atual"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Renovar</span>
          </button>
          <button 
            onClick={() => onDelete(item.id)} 
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition"
            title="Excluir item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}