import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ProductForm from './pages/ProductForm';
import Login from './pages/Login';
import Register from './pages/Register';

// Navbar as a separate component so it can use hooks
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Koperasi Desa</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Beranda</Link></li>
        <li><Link to="/products">Produk</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/products/add" className="nav-link-add">+ Tambah Produk</Link></li>
            <li className="nav-user-info">
              <span className="nav-username">👤 {user?.username}</span>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="nav-btn-logout"
                id="navbar-logout-btn"
              >
                Keluar
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" className="nav-btn-login" id="navbar-login-btn">
              Masuk
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          {/* Navbar */}
          <Navbar />

          {/* Konten Utama */}
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes — hanya bisa diakses jika sudah login */}
              <Route
                path="/products/add"
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/edit/:id"
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="footer">
            <p>&copy; 2026 Koperasi Desa — Dibuat dengan ❤️ untuk belajar.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
