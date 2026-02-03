import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '@/api/client';
import DashboardPage from './DashboardPage';
import LoginPage from './LoginPage';

const Index = () => {
  const navigate = useNavigate();
  const token = getAuthToken();

  useEffect(() => {
    // Verifica se há token ao carregar
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Se não tem token, mostra login
  if (!token) {
    return <LoginPage />;
  }

  // Se tem token, mostra dashboard
  return <DashboardPage />;
};

export default Index;
