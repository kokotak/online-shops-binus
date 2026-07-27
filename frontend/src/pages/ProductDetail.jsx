import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    // Mengambil detail produk dari Backend API berdasarkan ID
    axios.get(`${API_BASE_URL}/api/products/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Terjadi kesalahan:", error);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      axios.delete(`${API_BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          alert('Produk berhasil dihapus.');
          navigate('/products');
        })
        .catch(error => {
          console.error("Gagal menghapus produk:", error);
          alert('Gagal menghapus produk.');
        });
    }
  };

  if (loading) {
    return <div className="loading">Memuat detail produk...</div>;
  }

  if (!product) {
    return <div className="error">Produk tidak ditemukan.</div>;
  }

  return (
    <div className="product-detail-page">
      <Link to="/products" className="back-link">← Kembali ke Daftar Produk</Link>
      
      <div className="product-detail-container">
        <div className="product-detail-image-box">
          <img src={product.imageUrl} alt={product.name} className="product-detail-image" />
        </div>
        
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p className="product-detail-price">Rp {product.price.toLocaleString('id-ID')}</p>
          <div className="product-detail-desc">
            <h3>Deskripsi Produk:</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="action-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            {isAuthenticated && (
              <>
                <Link to={`/products/edit/${product._id}`} className="btn-secondary">
                  Edit Produk
                </Link>
                <button className="btn-danger" onClick={handleDelete} style={{
                  backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500'
                }}>
                  Hapus Produk
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
