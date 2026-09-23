export const PRESET_ITEMS = [
  { name: 'Óleo do Motor & Filtro', defaultKm: 10000, defaultMonths: 12, category: 'Motor' },
  { name: 'Velas de Ignição', defaultKm: 30000, defaultMonths: 24, category: 'Motor' },
  { name: 'Correia Dentada / Sincronizadora', defaultKm: 50000, defaultMonths: 36, category: 'Motor' },
  { name: 'Limpeza de Sensores (MAF/MAP) & TBI', defaultKm: 20000, defaultMonths: 12, category: 'Sensores' },
  { name: 'Filtro de Ar do Motor', defaultKm: 15000, defaultMonths: 12, category: 'Motor' },
  { name: 'Filtro de Combustível', defaultKm: 10000, defaultMonths: 12, category: 'Injeção' },
  { name: 'Fluido de Freio', defaultKm: 20000, defaultMonths: 24, category: 'Freios' },
  { name: 'Pastilhas de Freio', defaultKm: 25000, defaultMonths: 24, category: 'Freios' },
  { name: 'Fluido de Arrefecimento (Radiador)', defaultKm: 40000, defaultMonths: 24, category: 'Arrefecimento' }
];

export function calculateStatus(item, currentKm) {
  if (!item || !item.lastKm) return { status: 'OK', message: 'Sem dados', percentage: 0 };

  const targetKm = Number(item.lastKm) + Number(item.intervalKm);
  const kmRemaining = targetKm - Number(currentKm);
  const kmProgress = ((Number(currentKm) - Number(item.lastKm)) / Number(item.intervalKm)) * 100;

  let daysRemaining = Infinity;
  let dateProgress = 0;

  if (item.lastDate && item.intervalMonths) {
    const last = new Date(item.lastDate);
    const targetDate = new Date(last.setMonth(last.getMonth() + Number(item.intervalMonths)));
    const now = new Date();
    const diffTime = targetDate - now;
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const totalDays = Number(item.intervalMonths) * 30.4;
    dateProgress = ((totalDays - daysRemaining) / totalDays) * 100;
  }

  const worstProgress = Math.max(kmProgress, dateProgress);

  if (kmRemaining <= 0 || daysRemaining <= 0) {
    return {
      status: 'CRITICAL',
      badge: 'bg-red-500/10 text-red-500 border-red-500/20',
      bar: 'bg-red-500',
      message: kmRemaining <= 0 ? `Vencido por ${Math.abs(kmRemaining)} km` : `Vencido por ${Math.abs(daysRemaining)} dias`,
      percentage: Math.min(Math.max(worstProgress, 0), 100)
    };
  }

  if (kmRemaining <= 1000 || daysRemaining <= 30) {
    return {
      status: 'WARNING',
      badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      bar: 'bg-amber-500',
      message: `Atenção: restam ${kmRemaining} km ou ${daysRemaining} dias`,
      percentage: Math.min(Math.max(worstProgress, 0), 100)
    };
  }

  return {
    status: 'OK',
    badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    bar: 'bg-emerald-500',
    message: `Ok (${kmRemaining} km ou ${daysRemaining} dias restantes)`,
    percentage: Math.min(Math.max(worstProgress, 0), 100)
  };
}