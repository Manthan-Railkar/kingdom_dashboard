import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AdminProvider } from './context/AdminContext';
import { SettingsProvider } from './context/SettingsContext';
import Dashboard from './pages/Dashboard';
import CaptainLogin from './components/admin/CaptainLogin';

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppProvider>
          <AdminProvider>
            <Routes>
              <Route path="/captain" element={<CaptainLogin />} />
              <Route path="/*" element={<Dashboard />} />
            </Routes>
          </AdminProvider>
        </AppProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
