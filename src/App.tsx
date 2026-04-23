import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Broadcast from './pages/Broadcast';
import Statistics from './pages/Statistics';
import Channels from './pages/Channels';
import Prices from './pages/Prices';
import Commands from './pages/Commands';
import Settings from './pages/Settings';
import LoadingSpinner from './components/LoadingSpinner';

function ProtectedRoutes() {
  const { admin, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!admin) return <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="broadcast" element={<Broadcast />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="channels" element={<Channels />} />
        <Route path="prices" element={<Prices />} />
        <Route path="commands" element={<Commands />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

function AuthRoutes() {
  const { admin, isLoading } = useAuth();
  if (isLoading) return null;
  if (admin) return <Navigate to="/" replace />;
  return <Login />;
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<AuthRoutes />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
