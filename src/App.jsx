// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './components/pages/Home_Page';
import Register from './components/pages/Register_Page';
import Profile from './components/pages/Profile_Page';
import ForgetPassword from './components/pages/ForgetPassword_Page';
import LoginProvider from "./components/pages/LoginPovider_Page";
import ConfirmEmail from "./components/pages/Temp";
import LoadingScreen from "./components/common/LoadingScreen";
import AF2_Page from "./components/pages/2AF_PAge";
import { LoadingProvider, useLoading } from './components/context/LoadingContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Cria uma instância do QueryClient
const queryClient = new QueryClient();

function PrivateRoute({ element }) {
  const { redirect } = useLoading();

  // Verifica se o usuário tem permissão para acessar a rota
  return redirect ? element : <Navigate to="/" />;
}

function PrivateRoute2FA({ element }) {
  const { redirect2AF } = useLoading();

  useEffect(() => {
    console.log('redirect2Af', redirect2AF);
  }, [redirect2AF]);

  // Verifica se o 2FA está habilitado e permite o acesso
  return redirect2AF ? element : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/confirmEmail" element={<ConfirmEmail />} />

      {/* Rotas privadas gerais */}
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      <Route path="/loginProvider" element={<PrivateRoute element={<LoginProvider />} />} />
      <Route path="/confirmEmail" element={<PrivateRoute element={<ConfirmEmail />} />} />

      {/* Rota privada exclusiva para 2FA */}
      <Route path="/2fa" element={<PrivateRoute2FA element={<AF2_Page />} />} />
    </Routes>
  );
}
// Componente principal que verifica o estado de carregamento
function App() {
  const { loading } = useLoading();

  return (
    <>
      <LoadingScreen show={loading} />
      <AppRoutes />
    </>
  );
}

// Função para envolver o App com os provedores
export default function AppWithProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <Router>
          <div className='App'>
            <App />
          </div>
        </Router>
      </LoadingProvider>
    </QueryClientProvider>
  );
}
