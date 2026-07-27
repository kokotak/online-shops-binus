import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — Membungkus route yang memerlukan login.
 * Jika user belum terautentikasi, redirect ke halaman /login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Tunggu sampai status auth selesai dicek dari localStorage
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Memuat...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
