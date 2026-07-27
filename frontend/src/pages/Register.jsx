import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasi password konfirmasi
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('Registrasi berhasil! Mengarahkan ke halaman login...');
      setTimeout(() => navigate('/login'), 2000);
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

      <div className="auth-card auth-card-register">
        {/* Logo / Brand */}
        <div className="auth-brand">
          <div className="auth-logo">🌿</div>
          <h1 className="auth-title">Buat Akun Baru</h1>
          <p className="auth-subtitle">Bergabung dengan Koperasi Desa</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="auth-error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="auth-success" role="status">
            <span>✅</span> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" id="register-form">
          <div className="auth-form-group">
            <label htmlFor="reg-username">Nama Pengguna</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">👤</span>
              <input
                id="reg-username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nama Anda"
                required
                minLength={3}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label htmlFor="reg-email">Email</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">✉️</span>
              <input
                id="reg-email"
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
            <label htmlFor="reg-password">Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">🔒</span>
              <input
                id="reg-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label htmlFor="reg-confirm-password">Konfirmasi Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">🔐</span>
              <input
                id="reg-confirm-password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password Anda"
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            id="register-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-btn-loading">
                <span className="auth-spinner"></span> Mendaftar...
              </span>
            ) : (
              'Daftar Sekarang'
            )}
          </button>
        </form>

        <div className="auth-footer-link">
          Sudah punya akun?{' '}
          <Link to="/login" id="go-to-login">Masuk di sini →</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
