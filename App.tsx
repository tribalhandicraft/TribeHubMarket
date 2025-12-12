import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Login from './pages/Login';
import ProducerDashboard from './pages/ProducerDashboard';

// Layout wrapper for pages with Navbar
// Fix: Make children optional in props type to avoid "missing in type '{}'" error
const Layout = ({ children }: { children?: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
  </>
);

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/producer" element={<Layout><ProducerDashboard /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;