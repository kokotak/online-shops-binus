import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import heroImage from '../assets/hero_basket.png';
import API_BASE_URL from '../api';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Ambil 4 produk pertama untuk ditampilkan di "Produk Terlaris"
    axios.get(`${API_BASE_URL}/api/products`)
      .then(res => setFeaturedProducts(res.data.slice(0, 4)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="home-wrapper">

      {/* ── HERO SECTION ── */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-eyebrow">🛒 Toko Online Terpercaya</span>
          <h1 className="hero-title">
            Belanja Produk<br />
            <span className="hero-title-accent">Terbaik & Terjangkau</span>
          </h1>
          <p className="hero-desc">
            Temukan ribuan produk pilihan dengan kualitas terbaik, harga bersaing,
            dan pengiriman cepat langsung ke pintu Anda.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn-hero-primary">Belanja Sekarang</Link>
            <Link to="/products" className="btn-hero-secondary">Lihat Semua Produk →</Link>
          </div>
        </div>
        <div className="hero-image-box">
          <img src={heroImage} alt="Keranjang Belanja" className="hero-img" />
        </div>
      </section>

      {/* ── BADGE FITUR ── */}
      <section className="features-bar">
        <div className="feature-item">
          <span className="feature-icon">⭐</span>
          <div>
            <div className="feature-title">Produk Pilihan</div>
            <div className="feature-desc">Semua terseleksi ketat</div>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔒</span>
          <div>
            <div className="feature-title">Pembayaran Aman</div>
            <div className="feature-desc">100% terenkripsi</div>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">↩️</span>
          <div>
            <div className="feature-title">Bisa Dikembalikan</div>
            <div className="feature-desc">Garansi 7 hari</div>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🚚</span>
          <div>
            <div className="feature-title">Gratis Ongkir</div>
            <div className="feature-desc">Minimal pembelian Rp100rb</div>
          </div>
        </div>
      </section>

      {/* ── KATEGORI ── */}
      <section className="category-section">
        <h2 className="section-heading">Kategori Populer</h2>
        <div className="category-grid">
          {[
            { icon: '👟', name: 'Sepatu' },
            { icon: '👜', name: 'Tas' },
            { icon: '⌚', name: 'Jam Tangan' },
            { icon: '👕', name: 'Pakaian' },
            { icon: '🕶️', name: 'Aksesoris' },
          ].map(cat => (
            <Link to="/products" key={cat.name} className="category-card">
              <div className="category-icon">{cat.icon}</div>
              <div className="category-name">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BANNER ── */}
      <section className="promo-banner">
        <div className="promo-banner-inner">
          <div className="promo-emoji">🌿</div>
          <div className="promo-text">
            <h3>Kualitas yang Bisa Anda Percaya</h3>
            <p>Setiap produk kami melalui proses seleksi ketat untuk memastikan Anda mendapatkan yang terbaik. Kepuasan Anda adalah prioritas utama kami.</p>
            <Link to="/products" className="btn-banner">Pelajari Lebih Lanjut</Link>
          </div>
        </div>
      </section>

      {/* ── PRODUK TERLARIS ── */}
      <section className="bestsell-section">
        <div className="bestsell-header">
          <h2 className="section-heading">Produk Terlaris</h2>
          <Link to="/products" className="see-all-link">Lihat Semua →</Link>
        </div>

        {featuredProducts.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>Memuat produk...</p>
        ) : (
          <div className="home-product-grid">
            {featuredProducts.map(product => (
              <Link to={`/products/${product._id}`} key={product._id} className="home-product-card">
                <div className="home-product-img-box">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="home-product-img" />
                  ) : (
                    <div className="home-product-img-placeholder">🛍️</div>
                  )}
                </div>
                <div className="home-product-info">
                  <div className="home-product-name">{product.name}</div>
                  <div className="home-product-price">Rp {product.price.toLocaleString('id-ID')}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/products" className="btn-show-more">Tampilkan Lebih Banyak</Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
