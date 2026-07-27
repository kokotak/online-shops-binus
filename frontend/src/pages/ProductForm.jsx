import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api';

function ProductForm() {
  const { token } = useAuth();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [imageFile, setImageFile] = useState(null);
  // State untuk preview gambar sebelum dikirim
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      axios.get(`${API_BASE_URL}/api/products/${id}`)
        .then(response => {
          setProduct({
            name: response.data.name,
            description: response.data.description,
            price: response.data.price
          });
          // Tampilkan gambar lama sebagai preview
          if (response.data.imageUrl) {
            setImagePreview(response.data.imageUrl);
          }
        })
        .catch(error => {
          console.error("Gagal mengambil data produk:", error);
          alert("Gagal memuat data produk untuk diedit.");
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Buat URL sementara di browser untuk preview gambar
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi: gambar wajib ada saat tambah produk baru
    if (!isEditMode && !imageFile) {
      alert("Harap pilih gambar produk terlebih dahulu!");
      return;
    }

    setLoading(true);

    // Menggunakan FormData agar bisa mengirim file sekaligus teks
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const authHeaders = { Authorization: `Bearer ${token}` };

    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/api/products/${id}`, formData, { headers: authHeaders });
        alert('Produk berhasil diubah!');
        navigate(`/products/${id}`);
      } else {
        await axios.post(`${API_BASE_URL}/api/products`, formData, { headers: authHeaders });
        alert('Produk baru berhasil ditambahkan!');
        navigate('/products');
      }
    } catch (error) {
      // Tampilkan pesan error yang lebih detail dari server
      const pesanError = error.response?.data?.message || error.message || 'Terjadi kesalahan tidak diketahui';
      console.error("Error:", error.response || error);
      alert(`Gagal menyimpan produk: ${pesanError}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-page">
      <Link to="/products" className="back-link">← Kembali ke Daftar Produk</Link>

      <div className="form-container">
        <h2>{isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Nama Produk</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              placeholder="Contoh: Sepatu Kets"
            />
          </div>

          <div className="form-group">
            <label>Harga (Rp)</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              placeholder="Contoh: 150000"
            />
          </div>

          <div className="form-group">
            <label>Upload Gambar Produk</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
            {isEditMode && (
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#64748b' }}>
                *Biarkan kosong jika tidak ingin mengubah gambar
              </small>
            )}
            {/* Preview gambar */}
            {imagePreview && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.5rem' }}>Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Deskripsi Produk</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Jelaskan produk ini..."
            ></textarea>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Tambah Produk')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
