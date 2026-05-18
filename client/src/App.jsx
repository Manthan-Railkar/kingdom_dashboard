import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AdminProvider } from './context/AdminContext';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AdminProvider>
          <Routes>
            <Route path="/*" element={<Dashboard />} />
          </Routes>
        </AdminProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
