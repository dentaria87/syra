import { Users, Phone, Calendar, FileCheck, Search, Filter, MoreHorizontal, Bell, Euro, TrendingUp, Clock, RefreshCw, X, StickyNote, CheckSquare, BarChart3, Upload, FileText } from 'lucide-react';
import { useState } from 'react';
import { Lead, Contract } from '../types';

const mockLeads: Lead[] = [
  {
    id: '1',
    organization_id: '1',
    first_name: 'Madame',
    last_name: 'DAHCHAR',
    email: 'dahchar@icloud.com',
    phone: '0781170861',
    status: 'NRP',
    priority: 'moyenne',
    imposition: '+2500€',
    birth_year: 2000,
    postal_code: '69600',
    city: 'oullins',
    profession: '',
    residence_status: 'Locataire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '2',
    organization_id: '1',
    first_name: 'Monsieur',
    last_name: 'DUPART',
    email: 'dupart33@gmail.com',
    phone: '0688523264',
    status: 'À rappeler',
    priority: 'moyenne',
    imposition: '+2500€',
    birth_year: 1943,
    postal_code: '33000',
    city: 'bordeaux',
    profession: '',
    residence_status: 'Proprietaire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '3',
    organization_id: '1',
    first_name: 'Yannick',
    last_name: 'GOASDOUE',
    email: 'nikenyan0@gmail.com',
    phone: '0687180650',
    status: 'NRP',
    priority: 'moyenne',
    imposition: '+2500€',
    birth_year: 1976,
    postal_code: '22290',
    city: '',
    profession: '',
    residence_status: '',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
  {
    id: '4',
    organization_id: '1',
    first_name: 'Emilie',
    last_name: 'LECOURT',
    email: 'elecourt@laposte.net',
    phone: '0673183510',
    status: 'NRP',
    priority: 'moyenne',
    imposition: '+2500€',
    birth_year: 1985,
    postal_code: '27450',
    city: '',
    profession: '',
    residence_status: 'Proprietaire',
    created_at: '2025-10-02',
    updated_at: '2025-10-02',
  },
];

interface DashboardProps {
  onNotificationClick: () => void;
  notificationCount: number;
  onNavigateToClients?: (showPending: boolean) => void;
  onNavigateToLeads?: (filter: string | null) => void;
}

interface Memo {
  id: string;
  title: string;
  date: string;
  time: string;
  user: string;
  color: string;
}

const mockMemos: Memo[] = [
  { id: '1', title: 'Rappeler Mme DAHCHAR pour finaliser RDV', date: "Aujourd'hui", time: '14:30', user: 'Vous', color: 'blue' },
  { id: '2', title: 'Envoyer documents à M. DUPART', date: 'Demain', time: '10:00', user: 'Vous', color: 'violet' },
  { id: '3', title: 'Relancer leads en attente de signature', date: 'Cette semaine', time: '16:00', user: 'Équipe', color: 'orange' },
  { id: '4', title: 'Préparer rapport mensuel', date: '25 Oct', time: '09:00', user: 'Manager', color: 'green' },
  { id: '5', title: 'Formation nouveaux produits', date: '28 Oct', time: '14:00', user: 'Équipe', color: 'amber' },
];

export default function Dashboard({ onNotificationClick, notificationCount, onNavigateToClients, onNavigateToLeads }: DashboardProps) {
  const [showMemosModal, setShowMemosModal] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [showEditContractModal, setShowEditContractModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [volumePeriod, setVolumePeriod] = useState<'week' | 'month'>('week');
  const [leadsChartPeriod, setLeadsChartPeriod] = useState<'week' | 'month'>('week');
  const [fadingMemos, setFadingMemos] = useState<Set<string>>(new Set());
  const [visibleMemos, setVisibleMemos] = useState<Set<string>>(() => new Set(mockMemos.map(m => m.id)));

  const mockContracts: Contract[] = [
    {
      id: '1',
      organization_id: '1',
      client_name: 'Jean DUPONT',
      contract_type: 'Assurance vie',
      amount: 15000,
      status: 'pending',
      error_type: 'missing_document',
      is_reprise: false,
      created_at: '2025-10-20',
      updated_at: '2025-10-20',
    },
    {
      id: '2',
      organization_id: '1',
      client_name: 'Marie MARTIN',
      contract_type: 'PER',
      amount: 8000,
      status: 'pending',
      error_type: 'invalid_iban',
      is_reprise: true,
      reprise_success: false,
      created_at: '2025-10-19',
      updated_at: '2025-10-19',
    },
    {
      id: '3',
      organization_id: '1',
      client_name: 'Pierre BERNARD',
      contract_type: 'Retraite',
      amount: 25000,
      status: 'validated',
      validation_date: '2025-10-18',
      is_reprise: false,
      created_at: '2025-10-15',
      updated_at: '2025-10-18',
    },
    {
      id: '4',
      organization_id: '1',
      client_name: 'Sophie DUBOIS',
      contract_type: 'Assurance vie',
      amount: 18000,
      status: 'validated',
      validation_date: '2025-10-17',
      is_reprise: false,
      created_at: '2025-10-12',
      updated_at: '2025-10-17',
    },
  ];


  const monthlyVolume = mockContracts
    .filter(c => c.status === 'validated')
    .reduce((sum, c) => sum + c.amount, 0);

  const validatedContracts = mockContracts.filter(c => c.status === 'validated').length;
  const pendingFiles = mockContracts.filter(c => c.status === 'pending').length;
  const reprises = mockContracts.filter(c => c.is_reprise).length;
  const repriseSuccess = mockContracts.filter(c => c.is_reprise && c.reprise_success).length;
  const repriseRate = reprises > 0 ? Math.round((repriseSuccess / reprises) * 100) : 0;

  const totalLeads = mockLeads.length;
  const contactedLeads = mockLeads.filter(l => l.status !== 'NRP' && l.status !== 'Sans Statut').length;
  const convertedLeads = mockLeads.filter(l => l.status === 'Signé').length;
  const transformationRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  const kpis = [
    { label: 'Volume du mois', value: `${monthlyVolume.toLocaleString('fr-FR')} €`, icon: Euro, color: 'from-emerald-400 to-emerald-600', trend: '+12%' },
    { label: 'Contrats validés', value: validatedContracts.toString(), icon: FileCheck, color: 'from-blue-400 to-blue-600', trend: '+8%' },
    { label: 'Dossiers en attente', value: pendingFiles.toString(), icon: Clock, color: 'from-amber-400 to-amber-600', trend: '-5%' },
    { label: `Reprises (${repriseRate}%)`, value: reprises.toString(), icon: RefreshCw, color: 'from-violet-400 to-violet-600', trend: '+3%' },
  ];

  const volumeChartData = volumePeriod === 'week'
    ? [
        { label: 'S1', value: 45000 },
        { label: 'S2', value: 52000 },
        { label: 'S3', value: 48000 },
        { label: 'S4', value: 55000 },
      ]
    : [
        { label: 'Jan', value: 185000 },
        { label: 'Fév', value: 195000 },
        { label: 'Mar', value: 210000 },
        { label: 'Avr', value: 198000 },
        { label: 'Mai', value: 225000 },
        { label: 'Jun', value: 240000 },
        { label: 'Jul', value: 215000 },
        { label: 'Aoû', value: 180000 },
        { label: 'Sep', value: 235000 },
        { label: 'Oct', value: 250000 },
        { label: 'Nov', value: 245000 },
        { label: 'Déc', value: 260000 },
      ];

  const maxVolume = Math.max(...volumeChartData.map(d => d.value));

  const leadsTransformationData = leadsChartPeriod === 'week'
    ? [
        { label: 'Lun', leads: 8, converted: 2 },
        { label: 'Mar', leads: 12, converted: 3 },
        { label: 'Mer', leads: 10, converted: 4 },
        { label: 'Jeu', leads: 15, converted: 5 },
        { label: 'Ven', leads: 11, converted: 3 },
        { label: 'Sam', leads: 5, converted: 1 },
        { label: 'Dim', leads: 3, converted: 0 },
      ]
    : [
        { label: 'S1', leads: 45, converted: 12 },
        { label: 'S2', leads: 52, converted: 15 },
        { label: 'S3', leads: 48, converted: 18 },
        { label: 'S4', leads: 55, converted: 20 },
      ];

  const maxLeadsValue = Math.max(...leadsTransformationData.map(d => Math.max(d.leads, d.converted)));

  const nextMemo = mockMemos[0];

  const handleMemoClick = (memoId: string) => {
    setFadingMemos(prev => new Set(prev).add(memoId));
    setTimeout(() => {
      setVisibleMemos(prev => {
        const newSet = new Set(prev);
        newSet.delete(memoId);
        return newSet;
      });
      setFadingMemos(prev => {
        const newSet = new Set(prev);
        newSet.delete(memoId);
        return newSet;
      });
    }, 400);
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Dashboard</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Visualisez vos métriques et performances en temps réel</p>
        </div>
        <button
          onClick={onNotificationClick}
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm relative flex-shrink-0"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-light shadow-lg animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>
      </header>

      <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-5 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-5">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="glass-card glass-card-hover p-4 md:p-5 floating-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-light mb-1">{kpi.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-light text-gray-900">{kpi.value}</p>
                      <span className={`text-xs font-light px-2 py-1 rounded-full ${
                        kpi.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {kpi.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div
            className="glass-card glass-card-hover p-4 md:p-5 floating-shadow cursor-pointer bg-gradient-to-r from-red-50/80 to-red-100/40 backdrop-blur-xl border-red-200/50"
            onClick={() => setShowMemosModal(true)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <StickyNote className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-light mb-1">Mémo & Rappels</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-light text-gray-900">{mockMemos.length}</p>
                  <span className="text-xs font-light px-2 py-1 rounded-full bg-red-200/50 text-red-700 border border-red-300/30">
                    urgent
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-5">
          <div className="lg:col-span-2 glass-card p-4 floating-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-light text-gray-900">Volume de contrats validés</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setVolumePeriod('week')}
                  className={`px-3 py-1.5 text-xs font-light rounded-full transition-all ${
                    volumePeriod === 'week'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                      : 'bg-white/80 text-gray-600 hover:bg-white'
                  }`}
                >
                  4 dernières semaines
                </button>
                <button
                  onClick={() => setVolumePeriod('month')}
                  className={`px-3 py-1.5 text-xs font-light rounded-full transition-all ${
                    volumePeriod === 'month'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                      : 'bg-white/80 text-gray-600 hover:bg-white'
                  }`}
                >
                  12 mois
                </button>
              </div>
            </div>
            <div className="h-72 overflow-x-auto">
              <div className={`grid gap-2 h-full ${volumePeriod === 'week' ? 'grid-cols-4' : 'grid-cols-12'}`}>
                {volumeChartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 font-light mb-2">{data.label}</span>
                    <div className="flex-1 w-full flex items-end justify-center">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all hover:from-emerald-600 hover:to-emerald-500 cursor-pointer shadow-sm"
                        style={{ height: `${(data.value / maxVolume) * 100}%`, minHeight: '20px' }}
                        title={`${data.value.toLocaleString('fr-FR')} €`}
                      />
                    </div>
                    <span className="text-[9px] text-gray-600 font-light mt-1">{(data.value / 1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-6 floating-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-light text-gray-900">Dossiers en attente</h3>
              <span className="text-2xl font-light text-gray-900">
                {mockContracts.filter(c => c.status === 'pending').length}
              </span>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {mockContracts.filter(c => c.status === 'pending').map((contract) => (
                <div
                  key={contract.id}
                  onClick={() => {
                    setSelectedContract(contract);
                    setShowEditContractModal(true);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all ${
                  contract.error_type === 'missing_document' ? 'bg-gradient-to-r from-red-50 to-red-100/30 border-red-200/50' :
                  contract.error_type === 'invalid_iban' ? 'bg-gradient-to-r from-amber-50 to-amber-100/30 border-amber-200/50' :
                  contract.error_type === 'invalid_proof' ? 'bg-gradient-to-r from-orange-50 to-orange-100/30 border-orange-200/50' :
                  'bg-gradient-to-r from-blue-50 to-blue-100/30 border-blue-200/50'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{contract.client_name}</p>
                      <p className="text-xs text-gray-600 font-light">{contract.contract_type}</p>
                    </div>
                    <span className="text-xs font-light text-gray-900">{contract.amount.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className={`text-xs font-light px-2 py-1 rounded-full inline-block ${
                    contract.error_type === 'missing_document' ? 'bg-red-200/50 text-red-700' :
                    contract.error_type === 'invalid_iban' ? 'bg-amber-200/50 text-amber-700' :
                    contract.error_type === 'invalid_proof' ? 'bg-orange-200/50 text-orange-700' :
                    'bg-blue-200/50 text-blue-700'
                  }`}>
                    {contract.error_type === 'missing_document' ? 'Pièce manquante' :
                     contract.error_type === 'invalid_iban' ? 'IBAN invalide' :
                     contract.error_type === 'invalid_proof' ? 'Justificatif invalide' :
                     contract.error_type === 'signature_missing' ? 'Signature manquante' :
                     'Autre erreur'}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigateToClients && onNavigateToClients(true)}
              className="w-full mt-4 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-light shadow-md flex items-center justify-center gap-2"
            >
              <Clock className="w-3.5 h-3.5" />
              Voir tous les dossiers en attente
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-4">
          <div className="glass-card p-6 floating-shadow">
            <h3 className="text-lg font-light text-gray-900 mb-6">Statistiques des Leads</h3>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl cursor-pointer hover:shadow-md transition-all"
                onClick={() => onNavigateToLeads?.(null)}
              >
                <p className="text-3xl font-light text-gray-900">{totalLeads}</p>
                <p className="text-sm text-gray-600 font-light mt-1">Total leads</p>
              </div>
              <div
                className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl cursor-pointer hover:shadow-md transition-all"
                onClick={() => onNavigateToLeads?.('NRP')}
              >
                <p className="text-3xl font-light text-gray-900">{contactedLeads}</p>
                <p className="text-sm text-gray-600 font-light mt-1">Contactés</p>
              </div>
              <div
                className="text-center p-4 bg-gradient-to-br from-violet-50 to-violet-100/30 rounded-xl cursor-pointer hover:shadow-md transition-all"
                onClick={() => onNavigateToLeads?.('RDV pris')}
              >
                <p className="text-3xl font-light text-gray-900">{convertedLeads}</p>
                <p className="text-sm text-gray-600 font-light mt-1">Convertis</p>
              </div>
              <div
                className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-xl cursor-pointer hover:shadow-md transition-all"
                onClick={() => onNavigateToLeads?.('À rappeler')}
              >
                <p className="text-3xl font-light text-gray-900">
                  {mockLeads.filter(l => l.status === 'À rappeler' || l.status === 'NRP').length}
                </p>
                <p className="text-sm text-gray-600 font-light mt-1">À rappeler</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 floating-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-light text-gray-900">Taux de transformation</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setLeadsChartPeriod('week')}
                  className={`px-3 py-1.5 text-xs font-light rounded-full transition-all ${
                    leadsChartPeriod === 'week'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'bg-white/80 text-gray-600 hover:bg-white'
                  }`}
                >
                  Jour
                </button>
                <button
                  onClick={() => setLeadsChartPeriod('month')}
                  className={`px-3 py-1.5 text-xs font-light rounded-full transition-all ${
                    leadsChartPeriod === 'month'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'bg-white/80 text-gray-600 hover:bg-white'
                  }`}
                >
                  Semaine
                </button>
              </div>
            </div>
            <div className="h-48">
              <div className={`grid gap-3 h-full ${leadsChartPeriod === 'week' ? 'grid-cols-7' : 'grid-cols-4'}`}>
                {leadsTransformationData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 font-light mb-2">{data.label}</span>
                    <div className="flex-1 w-full flex items-end justify-center gap-1 relative">
                      <div className="w-1/2 flex flex-col items-center justify-end">
                        <span className="text-[10px] text-blue-600 font-medium mb-1">{data.leads}</span>
                        <div
                          className="w-full bg-gradient-to-t from-blue-400 to-blue-300 rounded-t-lg transition-all hover:from-blue-500 hover:to-blue-400 cursor-pointer shadow-sm"
                          style={{ height: `${(data.leads / maxLeadsValue) * 100}%`, minHeight: '15px' }}
                          title={`${data.leads} leads`}
                        />
                      </div>
                      <div className="w-1/2 flex flex-col items-center justify-end">
                        <span className="text-[10px] text-violet-600 font-medium mb-1">{data.converted}</span>
                        <div
                          className="w-full bg-gradient-to-t from-violet-400 to-violet-300 rounded-t-lg transition-all hover:from-violet-500 hover:to-violet-400 cursor-pointer shadow-sm"
                          style={{ height: `${(data.converted / maxLeadsValue) * 100}%`, minHeight: '10px' }}
                          title={`${data.converted} convertis`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-300"></div>
                <span className="text-xs text-gray-600 font-light">Leads créés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-400 to-violet-300"></div>
                <span className="text-xs text-gray-600 font-light">Convertis</span>
              </div>
            </div>
          </div>
        </div>

        {showMemosModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900">Mémos & Rappels</h3>
                <button
                  onClick={() => setShowMemosModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-3">
                {mockMemos.filter(memo => visibleMemos.has(memo.id)).map((memo) => (
                  <div
                    key={memo.id}
                    onClick={() => handleMemoClick(memo.id)}
                    className={`p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all duration-400 ${
                      fadingMemos.has(memo.id) ? 'opacity-0' : 'opacity-100'
                    } ${
                    memo.color === 'blue' ? 'bg-gradient-to-r from-blue-50 to-blue-100/30 border-blue-200/50' :
                    memo.color === 'violet' ? 'bg-gradient-to-r from-violet-50 to-violet-100/30 border-violet-200/50' :
                    memo.color === 'orange' ? 'bg-gradient-to-r from-orange-50 to-orange-100/30 border-orange-200/50' :
                    memo.color === 'green' ? 'bg-gradient-to-r from-green-50 to-green-100/30 border-green-200/50' :
                    'bg-gradient-to-r from-amber-50 to-amber-100/30 border-amber-200/50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <input type="checkbox" className={`mt-1 w-4 h-4 rounded focus:ring-${memo.color}-500 text-${memo.color}-600`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{memo.title}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-600 font-light">{memo.date} - {memo.time}</span>
                            <span className="text-xs text-gray-500 font-light">• {memo.user}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showCallbackModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900">Leads à rappeler</h3>
                <button
                  onClick={() => setShowCallbackModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="space-y-3">
                {mockLeads.filter(lead => lead.status === 'À rappeler' || lead.status === 'NRP').map((lead) => (
                  <div key={lead.id} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/30 rounded-2xl border border-blue-200/50 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-light shadow-md">
                          {lead.first_name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{lead.first_name} {lead.last_name}</p>
                          <p className="text-xs text-gray-600 font-light">{lead.phone}</p>
                          <p className="text-xs text-gray-500 font-light mt-1">{lead.created_at}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-light border ${
                          lead.status === 'NRP' ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-orange-200/50' :
                          'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200/50'
                        }`}>
                          {lead.status}
                        </span>
                        <a href={`tel:${lead.phone}`} className="p-2 hover:bg-blue-200/50 rounded-full transition-colors">
                          <Phone className="w-4 h-4 text-blue-600" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showEditContractModal && selectedContract && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-gray-900">Compléter le dossier</h3>
                  <p className="text-sm text-gray-500 font-light mt-1">{selectedContract.client_name} - {selectedContract.contract_type}</p>
                </div>
                <button
                  onClick={() => {
                    setShowEditContractModal(false);
                    setSelectedContract(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-xl border bg-red-50 border-red-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-900">Pièce manquante</span>
                  </div>
                  <p className="text-sm text-gray-700 font-light">
                    {selectedContract.error_type === 'missing_document' ? 'Documents manquants pour finaliser le dossier' :
                     selectedContract.error_type === 'invalid_iban' ? 'IBAN invalide ou incomplet' :
                     selectedContract.error_type === 'invalid_proof' ? 'Justificatif invalide ou illisible' :
                     'Informations manquantes'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">Nom du client</label>
                  <input
                    type="text"
                    value={selectedContract.client_name}
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">Type de contrat</label>
                  <input
                    type="text"
                    value={selectedContract.contract_type}
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">Montant</label>
                  <input
                    type="text"
                    value={`${selectedContract.amount.toLocaleString('fr-FR')} €`}
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-light"
                  />
                </div>

                {selectedContract.error_type === 'missing_document' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">Documents manquants</label>
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-red-50 to-red-100/30 rounded-xl border border-red-200/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-medium text-gray-900">Pièce d'identité (CNI, Passeport, Permis)</span>
                          </div>
                        </div>
                        <label className="relative block">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => console.log('Fichier sélectionné:', e.target.files?.[0])}
                          />
                          <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <span>Télécharger le document</span>
                          </div>
                        </label>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/30 rounded-xl border border-amber-200/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-amber-600" />
                            <span className="text-sm font-medium text-gray-900">Justificatif de domicile (moins de 3 mois)</span>
                          </div>
                        </div>
                        <label className="relative block">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => console.log('Fichier sélectionné:', e.target.files?.[0])}
                          />
                          <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <span>Télécharger le document</span>
                          </div>
                        </label>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/30 rounded-xl border border-blue-200/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">RIB (Relevé d'Identité Bancaire)</span>
                          </div>
                        </div>
                        <label className="relative block">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => console.log('Fichier sélectionné:', e.target.files?.[0])}
                          />
                          <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <span>Télécharger le document</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {selectedContract.error_type === 'invalid_iban' && (
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">IBAN</label>
                    <input
                      type="text"
                      placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                    />
                  </div>
                )}

                {selectedContract.error_type === 'invalid_proof' && (
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">Télécharger un nouveau justificatif</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <FileCheck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 font-light">Cliquez pour télécharger un fichier</p>
                      <p className="text-xs text-gray-500 font-light mt-1">PDF, JPG ou PNG (max 5MB)</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">Notes additionnelles</label>
                  <textarea
                    placeholder="Ajoutez des remarques sur ce dossier..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowEditContractModal(false);
                      setSelectedContract(null);
                    }}
                    className="flex-1 px-6 py-2.5 bg-white/80 border border-gray-200 text-gray-700 rounded-full text-sm font-light hover:bg-white transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      console.log('Dossier complété');
                      setShowEditContractModal(false);
                      setSelectedContract(null);
                    }}
                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Valider le dossier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
