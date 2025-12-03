import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { BuyerEntryPage } from './pages/auth/BuyerEntryPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { BuyerStorefront } from './pages/buyer/BuyerStorefront';
import { OrderHistory } from './pages/buyer/OrderHistory';
import { LandingPage } from './pages/LandingPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    // Redirect to landing page if not logged in and trying to access protected route
    // Or maybe we should redirect to a specific login page?
    // For now, let's redirect to landing page where they can choose
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};

const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/buyer" replace />;
  
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'seller') return <Navigate to="/seller" replace />;
  if (user.role === 'buyer') return <Navigate to="/store" replace />;
  
  return <Navigate to="/buyer" replace />;
};

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin/login" element={<LoginPage role="admin" />} />
            <Route path="/seller/login" element={<LoginPage role="seller" />} />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/seller" element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/store" element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerStorefront />
              </ProtectedRoute>
            } />
            
            <Route path="/orders" element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <OrderHistory />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
