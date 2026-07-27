import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      login(res.data.token, res.data.user);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background decorations */}
      <div className="auth-bg-circle auth-bg-circle-1"></div>
      <div className="auth-bg-circle auth-bg-circle-2"></div>
      <div className="auth-bg-circle auth-bg-circle-3"></div>

      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-brand">
          <div className="auth-logo">🌿</div>
          <h1 className="auth-title">Koperasi Desa</h1>
          <p className="auth-subtitle">Masuk ke akun Anda</p>
        </div>

        {/* Demo credentials hint */}
        <div className="auth-demo-hint">
          <span>🔑</span>
          <div>
            <strong>Demo Admin:</strong>
            <span> admin@koperasi.com / admin123</span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="auth-error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          <div className="auth-form-group">
            <label htmlFor="login-email">Email</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">✉️</span>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label htmlFor="login-password">Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">🔒</span>
              <input
                id="login-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            id="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-btn-loading">
                <span className="auth-spinner"></span> Memproses...
              </span>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        <div className="auth-footer-link">
          Belum punya akun?{' '}
          <Link to="/register" id="go-to-register">Daftar sekarang →</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
