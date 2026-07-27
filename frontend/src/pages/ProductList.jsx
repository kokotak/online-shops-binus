import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    // Mengambil data produk dari Backend API
    axios.get(`${API_BASE_URL}/api/products`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Terjadi kesalahan saat mengambil data:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus produk.');
    }
  };

  if (loading) {
    return <div className="loading">Memuat produk...</div>;
  }

  return (
    <div className="product-list-page">
      <div className="product-list-header">
        <h2>Daftar Produk</h2>
        {isAuthenticated && (
          <Link to="/products/add" className="btn-primary">+ Tambah Produk</Link>
        )}
      </div>
      
      {products.length === 0 ? (
        <p>Belum ada produk yang tersedia.</p>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="product-image" />
              ) : (
                <div className="product-image-placeholder">🛍️</div>
              )}
              <h3>{product.name}</h3>
              <p className="price">Rp {product.price.toLocaleString('id-ID')}</p>
              <div className="product-card-actions">
                <Link to={`/products/${product._id}`} className="btn-secondary">Lihat Detail</Link>
                {isAuthenticated && (
                  <>
                    <Link to={`/products/edit/${product._id}`} className="btn-secondary btn-edit">Edit</Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn-delete"
                    >
                      Hapus
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
