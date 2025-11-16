import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Leads from './components/Leads';
import Calendrier from './components/Calendrier';
import Utilisateurs from './components/Utilisateurs';
import Listes from './components/Listes';
import DevoirConseil from './components/DevoirConseil';
import Partenaires from './components/Partenaires';
import MiseEnRelation from './components/MiseEnRelation';
import Performance from './components/Performance';
import Parametres from './components/Parametres';
import Client from './components/Client';
import NotificationsSidebar from './components/NotificationsSidebar';
import Login from './components/Login';
import { supabase } from './lib/supabase';
import { Bell } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPendingInClient, setShowPendingInClient] = useState(false);
  const [leadsFilter, setLeadsFilter] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const renderPage = () => {
    const pageProps = {
      onNotificationClick: () => setShowNotifications(!showNotifications),
      notificationCount: 1
    };

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard {...pageProps} onNavigateToClients={(showPending) => {
          setShowPendingInClient(showPending);
          setCurrentPage('client');
        }} onNavigateToLeads={(filter) => {
          setLeadsFilter(filter);
          setCurrentPage('leads');
        }} />;
      case 'leads':
        return <Leads {...pageProps} initialFilter={leadsFilter} />;
      case 'calendrier':
        return <Calendrier {...pageProps} />;
      case 'client':
        return <Client {...pageProps} initialShowPending={showPendingInClient} />;
      case 'utilisateurs':
        return <Utilisateurs {...pageProps} />;
      case 'listes':
        return <Listes {...pageProps} />;
      case 'devoir-conseil':
        return <DevoirConseil {...pageProps} />;
      case 'partenaires':
        return <Partenaires {...pageProps} />;
      case 'mise-en-relation':
        return <MiseEnRelation {...pageProps} />;
      case 'performance':
        return <Performance {...pageProps} />;
      case 'parametres':
        return <Parametres {...pageProps} />;
      default:
        return <Dashboard {...pageProps} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentPage(page);
            setIsTransitioning(false);
          }, 150);
        }}
        onCollapseChange={setIsSidebarCollapsed}
        onLogout={handleLogout}
      />
      <div id="contentRight" className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {renderPage()}
        </div>
      </div>
      <NotificationsSidebar isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  );
}

export default App;
