import React, { useState, useEffect } from 'react';
import { Plus, Gauge, AlertTriangle, CheckCircle, ShieldAlert, Car, History } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ItemCard } from '../components/ItemCard';
import { MaintenanceModal } from '../components/MaintenanceModal';
import { VehicleModal } from '../components/VehicleModal';
import { ResetModal } from '../components/ResetModal';
import { HistoryModal } from '../components/HistoryModal';
import { useNotifications } from '../hooks/useNotifications';
import { db, doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from '../services/firebase';
import { calculateStatus } from '../utils/helpers';

export function DashboardPage({ user }) {
  const [vehicle, setVehicle] = useState({ model: '', year: '', licensePlate: '', currentKm: 0 });
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [isKmEditing, setIsKmEditing] = useState(false);
  const [tempKm, setTempKm] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [resettingItem, setResettingItem] = useState(null);

  // Ativa as Notificações do Navegador
  useNotifications(items, vehicle.currentKm);

  // Sincronização em tempo real com Firestore
  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setVehicle(data.vehicle || { currentKm: 0 });
        setItems(data.items || []);
        setHistory(data.history || []);
        setTempKm(data.vehicle?.currentKm || 0);
      } else {
        setDoc(docRef, { vehicle: { currentKm: 0 }, items: [], history: [] });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpdateKm = async () => {
    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, { 'vehicle.currentKm': Number(tempKm) });
    setIsKmEditing(false);
  };

  const handleSaveItem = async (newItem) => {
    const docRef = doc(db, 'users', user.uid);
    const itemWithId = { ...newItem, id: Date.now().toString() };
    await updateDoc(docRef, { items: arrayUnion(itemWithId) });
  };

  // Confirmação de Renovação com Custo e Histórico
  const handleConfirmReset = async (item, historyData) => {
    const docRef = doc(db, 'users', user.uid);

    const updatedItems = items.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          lastKm: vehicle.currentKm,
          lastDate: historyData.date,
        };
      }
      return i;
    });

    await updateDoc(docRef, {
      items: updatedItems,
      history: arrayUnion(historyData),
    });
  };

  const handleDeleteItem = async (id) => {
    const itemToRemove = items.find((i) => i.id === id);
    if (!itemToRemove) return;
    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, { items: arrayRemove(itemToRemove) });
  };

  const handleSaveVehicle = async (vehicleData) => {
    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, {
      'vehicle.model': vehicleData.model,
      'vehicle.year': vehicleData.year,
      'vehicle.licensePlate': vehicleData.licensePlate,
    });
  };

  const criticalCount = items.filter((i) => calculateStatus(i, vehicle.currentKm).status === 'CRITICAL').length;
  const warningCount = items.filter((i) => calculateStatus(i, vehicle.currentKm).status === 'WARNING').length;
  const okCount = items.filter((i) => calculateStatus(i, vehicle.currentKm).status === 'OK').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20 sm:pb-10">
      <Navbar user={user} vehicle={vehicle} onOpenVehicleModal={() => setIsVehicleModalOpen(true)} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-6 space-y-6">
        {/* Painel do Hodômetro & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Gauge className="w-4 h-4 text-amber-500" />
                <span>QUILOMETRAGEM ATUAL DO VEÍCULO</span>
              </div>
              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className="sm:hidden text-xs text-amber-500 hover:underline flex items-center gap-1"
              >
                <Car className="w-3.5 h-3.5" />
                {vehicle.model || 'Configurar Carro'}
              </button>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              {isKmEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempKm}
                    onChange={(e) => setTempKm(e.target.value)}
                    className="bg-slate-800 border border-amber-500 text-2xl font-mono text-amber-400 font-bold rounded-xl px-3 py-1 w-44 focus:outline-none"
                  />
                  <button onClick={handleUpdateKm} className="bg-amber-500 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl">
                    Salvar
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                    {Number(vehicle.currentKm || 0).toLocaleString()}
                  </span>
                  <span className="text-slate-400 font-medium text-sm">KM</span>
                  <button
                    onClick={() => setIsKmEditing(true)}
                    className="cursor-pointer ml-2 text-xs text-amber-500/80 hover:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
                  >
                    Atualizar KM
                  </button>
                </>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Atualize a quilometragem periodicamente para obter previsões precisas.
            </p>
          </div>

          {/* Cards Rápidos de Resumo */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <ShieldAlert className="w-6 h-6 text-red-500 mb-1" />
              <span className="text-2xl font-bold font-mono text-slate-100">{criticalCount}</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">Críticos</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <AlertTriangle className="w-6 h-6 text-amber-500 mb-1" />
              <span className="text-2xl font-bold font-mono text-slate-100">{warningCount}</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">Atenção</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-6 h-6 text-emerald-500 mb-1" />
              <span className="text-2xl font-bold font-mono text-slate-100">{okCount}</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">Em Dia</span>
            </div>
          </div>
        </div>

        {/* Cabeçalho de Ações e Histórico */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Componentes Monitorados</h2>
            <p className="text-xs text-slate-400">Prazos e vencimentos por odômetro e tempo</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs px-3 py-2.5 rounded-xl transition"
              title="Ver histórico de custos e manutenções"
            >
              <History className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Histórico & Gastos</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/10 transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar Componente</span>
              <span className="sm:hidden">Novo</span>
            </button>
          </div>
        </div>

        {/* Lista de Cards */}
        {items.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <Gauge className="w-12 h-12 text-slate-700 mb-3" />
            <h3 className="font-semibold text-slate-300 mb-1">Nenhum componente cadastrado</h3>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              Cadastre itens como Velas, Correia Dentada e Óleo para começar o acompanhamento.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-amber-500 text-slate-950 font-semibold text-xs px-4 py-2 rounded-xl"
            >
              Adicionar Primeiro Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                currentKm={vehicle.currentKm}
                onReset={(itemToReset) => setResettingItem(itemToReset)}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modais */}
      <MaintenanceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveItem}
        currentKm={vehicle.currentKm}
      />

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        vehicle={vehicle}
        onSave={handleSaveVehicle}
      />

      <ResetModal
        isOpen={!!resettingItem}
        item={resettingItem}
        currentKm={vehicle.currentKm}
        onClose={() => setResettingItem(null)}
        onConfirm={handleConfirmReset}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
      />
    </div>
  );
}