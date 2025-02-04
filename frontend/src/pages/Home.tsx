import React, { useState, useEffect } from 'react';
import { Plus, Map, Settings } from 'lucide-react';
import { useAuthStore } from '../store/auth';

import type { Itinerary, Expense, Transport } from '../types';
import { Button } from '../components/common/button';
import { ItineraryCard } from "../components/features/trips/ItineraryCard";
import { ItineraryForm } from '../components/features/trips/ItineraryForm';
import { ExpenseForm } from "../components/features/budget/ExpenseForm";
import { ExpensesList } from "../components/features/budget/ExpensesList";
import { BudgetDashboard } from "../components/features/budget/BudgetDashboard";
import { NotificationToast } from "../components/common/notifications/NotificationToast";
import { NotificationSettings } from '../components/common/notifications/NotificationSettings';
import { TransportList } from '../components/features/transport/TransportList';
import { TransportForm } from '../components/features/transport/TransportForm';
import { useCurrencyStore } from '../lib/currency';
import { useBudgetNotifications } from '../hooks/useBudgetNotifications';
import { useNotificationStore } from '../lib/notifications';

export function Home() {
  const { user } = useAuthStore();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showTransportForm, setShowTransportForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [budget, setBudget] = useState(5000);
  const { fetchRates } = useCurrencyStore();
  const { scheduleTransportReminders } = useNotificationStore();

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  useBudgetNotifications(expenses, budget);

  // useEffect(() => {
  //   if (user) {
  //     getItineraries(user.id).then(setItineraries);
  //   }
  // }, [user]);

  const handleCreateItinerary = (data: any) => {
    setShowForm(false);
  };

  const handleAddExpense = (data: any) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      itinerary_id: editingId || '',
      ...data
    };
    setExpenses([...expenses, newExpense]);
    setShowExpenseForm(false);
  };

  const handleAddTransport = (data: Omit<Transport, 'id' | 'itinerary_id'>) => {
    const newTransport: Transport = {
      id: crypto.randomUUID(),
      itinerary_id: editingId || '',
      ...data
    };
    setTransports([...transports, newTransport]);
    
    // Imposta i reminder per il nuovo trasporto
    scheduleTransportReminders(newTransport);
    
    setShowTransportForm(false);
  };

  const handleEditTransport = (id: string) => {
    const transport = transports.find(t => t.id === id);
    if (transport) {
      setShowTransportForm(true);
      // Implementa la logica di modifica
    }
  };

  const handleDeleteTransport = (id: string) => {
    setTransports(transports.filter(t => t.id !== id));
  };

  const handleEditItinerary = (id: string) => {
    setEditingId(id);
  };

  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute min-w-full min-h-full object-cover"
          style={{ filter: 'brightness(0.6)' }}
        >
          <source
            src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen container mx-auto py-12 px-4">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Plan Your Journey</h1>
          <p className="text-xl">Create and manage your travel itineraries with ease</p>
        </div>

        {/* Settings Button */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white hover:bg-white/20"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Settings</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  ×
                </Button>
              </div>
              <NotificationSettings />
            </div>
          </div>
        )}

        {/* Budget Dashboard */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6 mb-8">
          <BudgetDashboard expenses={expenses} budget={budget} />
        </div>

        {/* Itineraries Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Your Itineraries</h2>
            <div className="space-x-4">
              <Button
                onClick={() => setShowExpenseForm(true)}
               
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Expense
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Itinerary
              </Button>
            </div>
          </div>

          {showForm ? (
            <div className="bg-white rounded-lg p-6">
              <ItineraryForm
                onSubmit={handleCreateItinerary}
                onCancel={() => setShowForm(false)}
              />
            </div>
          ) : showExpenseForm ? (
            <div className="bg-white rounded-lg p-6">
              <ExpenseForm
                onSubmit={handleAddExpense}
                onCancel={() => setShowExpenseForm(false)}
              />
            </div>
          ) : itineraries.length === 0 ? (
            <div className="text-center py-12">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You haven't created any itineraries yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Start by creating your first travel itinerary
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {itineraries.map((itinerary) => (
                  <ItineraryCard
                    key={itinerary.id}
                    itinerary={itinerary}
                    onEdit={handleEditItinerary}
                  />
                ))}
              </div>
              
              {expenses.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Expenses</h3>
                  <ExpensesList expenses={expenses} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Sezione Trasporti */}
        {editingId && (
          <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Transportation</h2>
              <Button
                onClick={() => setShowTransportForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Transport
              </Button>
            </div>

            {showTransportForm ? (
              <TransportForm
                onSubmit={handleAddTransport}
                onCancel={() => setShowTransportForm(false)}
              />
            ) : (
              <TransportList
                transports={transports.filter(t => t.itinerary_id === editingId)}
                onEdit={handleEditTransport}
                onDelete={handleDeleteTransport}
              />
            )}
          </div>
        )}

        <NotificationToast />
      </div>
    </div>
  );
}