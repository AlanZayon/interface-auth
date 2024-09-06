// src/App.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './components/pages/Home_Page';
import Register from './components/pages/Register_Page';
import Profile from './components/pages/Profile_Page';
import ForgetPassword from './components/pages/ForgetPassword_Page';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginProvider from "./components/pages/LoginPovider_Page";
import './App.css';

// Cria uma instância do QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className='App'>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/loginProvider" element={<LoginProvider />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}



export default App;
