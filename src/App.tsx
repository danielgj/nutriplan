import { useState } from 'react';
import { NutriProvider } from './context/NutriContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { WeeklyCalendar } from './components/WeeklyCalendar';
import { ShoppingList } from './components/ShoppingList';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';

const AppContent: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'shopping'>('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-stone-400">Cargando...</div>;
  }

  if (!user) {
    if (!showLogin) {
      return <LandingPage onGetStarted={() => setShowLogin(true)} />;
    }
    return <Login />;
  }

  return (
    <NutriProvider>
      <Layout currentView={currentView} onNavigate={setCurrentView} onLogout={logout}>
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
        {currentView === 'calendar' && <WeeklyCalendar />}
        {currentView === 'shopping' && <ShoppingList />}
      </Layout>
    </NutriProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
