// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './components/pages/Home_Page';
import Register from './components/pages/Register_Page';
import Profile from './components/pages/Profile_Page';
import ForgetPassword from './components/pages/ForgetPassword_Page';
import LoginProvider from "./components/pages/LoginPovider_Page";
import ConfirmEmail from "./components/pages/Temp";
import LoadingScreen from "./components/common/LoadingScreen";
import { LoadingProvider, useLoading } from './components/context/LoadingContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Cria uma instância do QueryClient
const queryClient = new QueryClient();

// Componente responsável pelas rotas
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/loginProvider" element={<LoginProvider />} />
      <Route path="/confirmEmail" element={<ConfirmEmail />} />
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
