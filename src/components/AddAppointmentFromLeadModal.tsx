import { X, Clock, Calendar as CalendarIcon, MapPin, Users, Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Lead } from '../types';

interface AddAppointmentFromLeadModalProps {
  onClose: () => void;
  lead: Lead;
}

const mockUsers = [
  { id: '1', name: 'Moche Azran', email: 'azran@bienviyance.com' },
  { id: '2', name: 'Sophie Martin', email: 'sophie@bienviyance.com' },
  { id: '3', name: 'Thomas Dubois', email: 'thomas@bienviyance.com' },
];

export default function AddAppointmentFromLeadModal({ onClose, lead }: AddAppointmentFromLeadModalProps) {
  const [title, setTitle] = useState(`RDV ${lead.first_name} ${lead.last_name}`);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [enableReminder, setEnableReminder] = useState(false);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState('1');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const mockCalendars = [
    { id: '1', name: 'Bienvisport', color: 'blue' },
    { id: '2', name: 'Bienviyance', color: 'green' },
    { id: '3', name: 'Entoria', color: 'orange' },
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[110] p-8">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200/30 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xl rounded-t-3xl">
            <h2 className="text-2xl font-light text-gray-900">Ajouter un rendez-vous</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">Titre du rendez-vous</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                placeholder="Consultation, Présentation..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">Lead / Prospect</label>
              <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-light shadow-md">
                    {lead.first_name.charAt(0)}{lead.last_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-light text-gray-900">{lead.first_name} {lead.last_name}</p>
                    <p className="text-xs text-gray-600 font-light">{lead.email}</p>
                    <p className="text-xs text-gray-600 font-light">{lead.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Heure
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Durée
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="90">1h30</option>
                  <option value="120">2 heures</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">Type de RDV</label>
                <select
                  value={appointmentType}
                  onChange={(e) => {
                    setAppointmentType(e.target.value);
                    setEnableReminder(e.target.value === 'rdv-physique' || e.target.value === 'visio');
                  }}
                  className="w-full px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                >
                  <option value="consultation">Consultation</option>
                  <option value="rdv-physique">RDV Physique (rappel 30min)</option>
                  <option value="visio">Visio (rappel 30min)</option>
                  <option value="appel">Appel téléphonique</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">Calendrier</label>
                <select
                  value={selectedCalendar}
                  onChange={(e) => setSelectedCalendar(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                >
                  {mockCalendars.map(cal => (
                    <option key={cal.id} value={cal.id}>{cal.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Lieu (optionnel)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                placeholder="Adresse ou lien de visio..."
              />
            </div>

            {enableReminder && (
              <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-light text-gray-900">Rappel activé</p>
                  <p className="text-xs text-gray-600 font-light mt-1">
                    Une notification sera envoyée 30 minutes avant le rendez-vous
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                Partager avec des collaborateurs (optionnel)
              </label>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Rechercher un collaborateur..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                />
              </div>

              {sharedWith.length > 0 && (
                <div className="mb-3 space-y-2">
                  <p className="text-xs text-gray-600 font-light">Collaborateurs sélectionnés:</p>
                  {sharedWith.map((userId) => {
                    const user = mockUsers.find(u => u.id === userId);
                    if (!user) return null;
                    return (
                      <div key={userId} className="flex items-center gap-3 p-3 bg-blue-50/80 rounded-2xl border border-blue-100">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-light shadow-md">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-light text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600 font-light">{user.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSharedWith(sharedWith.filter(id => id !== userId))}
                          className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all"
                        >
                          <X className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {userSearchQuery && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredUsers
                    .filter(user => !sharedWith.includes(user.id))
                    .map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSharedWith([...sharedWith, user.id]);
                          setUserSearchQuery('');
                        }}
                        className="w-full p-3 bg-white/80 hover:bg-white rounded-2xl border border-gray-200/50 flex items-center gap-3 transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-light shadow-md">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-light text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600 font-light">{user.email}</p>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">Notes (optionnel)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                placeholder="Informations complémentaires..."
              />
            </div>

            {showConfirmation && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 animate-scale-in">
                <p className="text-sm text-green-800 font-light text-center">
                  Un e-mail de confirmation sera envoyé au lead pour l'informer de ce rendez-vous.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2.5 bg-white/80 border border-gray-200/50 text-gray-700 rounded-full text-sm font-light hover:bg-white transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
              >
                Créer le rendez-vous
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}
