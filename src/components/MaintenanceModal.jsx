import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PRESET_ITEMS } from '../utils/helpers';

export function MaintenanceModal({ isOpen, onClose, onSave, currentKm }) {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Motor',
    lastKm: currentKm || '',
    lastDate: new Date().toISOString().split('T')[0],
    intervalKm: 10000,
    intervalMonths: 12
  });

  if (!isOpen) return null;

  const handleSelectPreset = (e) => {
    const val = e.target.value;
    setSelectedPreset(val);
    const preset = PRESET_ITEMS.find(p => p.name === val);
    if (preset) {
      setFormData(prev => ({
        ...prev,
        name: preset.name,
        category: preset.category,
        intervalKm: preset.defaultKm,
        intervalMonths: preset.defaultMonths
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.lastKm) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-slate-100">Adicionar Manutenção</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Selecionar Modelo Pré-definido</label>
            <select 
              value={selectedPreset} 
              onChange={handleSelectPreset}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="">Personalizado / Escolha um item...</option>
              {PRESET_ITEMS.map((p, idx) => (
                <option key={idx} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nome do Componente *</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Velas de Ignição"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">KM na Última Troca *</label>
              <input 
                type="number" 
                required
                value={formData.lastKm}
                onChange={e => setFormData({ ...formData, lastKm: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Data da Troca</label>
              <input 
                type="date" 
                value={formData.lastDate}
                onChange={e => setFormData({ ...formData, lastDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Trocar a cada (KM)</label>
              <input 
                type="number" 
                required
                value={formData.intervalKm}
                onChange={e => setFormData({ ...formData, intervalKm: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Trocar a cada (Meses)</label>
              <input 
                type="number" 
                required
                value={formData.intervalMonths}
                onChange={e => setFormData({ ...formData, intervalMonths: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-semibold py-3 rounded-xl transition shadow-lg shadow-amber-500/10 text-sm"
          >
            Salvar Componente
          </button>
        </form>
      </div>
    </div>
  );
}