const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'koperasi-desa-super-secret-key-2026';

// Buat folder uploads jika belum ada
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Konfigurasi Multer untuk penyimpanan file gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors({
  origin: '*', // Izinkan semua origin (frontend Vercel, localhost, dll)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Mengizinkan frontend untuk mengakses file statis di dalam folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// MIDDLEWARE: AUTENTIKASI JWT
// ==========================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
    }
    req.user = user;
    next();
  });
};

// Fungsi untuk menyalakan database di memori dan mengisi data awal
const startDatabase = async () => {
  try {
        const mongoUri = process.env.MONGO_URL || (await MongoMemoryServer.create()).getUri();
        await mongoose.connect(mongoUri);
        console.log(process.env.MONGO_URL ? '    console.log(process.env.MONGO_URL ? 'Connected to MongoDB!' : 'Connected to temporary memory database!');
    // Masukkan data dummy jika database kosong
    const count = await Product.countDocuments();
    if (count === 0) {
      const dummyProducts = [
        {
          name: "Sepatu Sneakers Klasik",
          description: "Sepatu sneakers yang sangat nyaman dipakai untuk kegiatan sehari-hari. Desainnya tak lekang oleh waktu.",
          price: 350000,
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"
        },
        {
          name: "Tas Ransel Hitam",
          description: "Tas ransel dengan kapasitas besar. Cocok untuk membawa laptop, buku, dan perlengkapan lainnya ke sekolah atau kantor.",
          price: 250000,
          imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
        },
        {
          name: "Jam Tangan Minimalis",
          description: "Jam tangan dengan desain elegan, jarum presisi tinggi, dan dilengkapi tali kulit sintetis berkualitas.",
          price: 150000,
          imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80"
        }
      ];
      await Product.insertMany(dummyProducts);
      console.log('✅ Data produk dummy berhasil ditambahkan!');
    }

    // Buat akun admin default jika belum ada
    const adminExists = await User.findOne({ email: 'admin@koperasi.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'Admin',
        email: 'admin@koperasi.com',
        password: hashedPassword,
      });
      console.log('✅ Akun admin default dibuat: admin@koperasi.com / admin123');
    }
  } catch (error) {
    console.error('❌ Gagal menyalakan database memori:', error);
  }
};

startDatabase();

// ==========================================
// AUTH ROUTES
// ==========================================

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    // Generate JWT token (berlaku 24 jam)
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login berhasil!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// VERIFY TOKEN (optional - untuk cek status login)
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ==========================================
// ROUTES / API ENDPOINTS (CRUD)
// ==========================================

// 1. READ: Mendapatkan semua produk (publik)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. READ: Mendapatkan detail satu produk berdasarkan ID (publik)
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. CREATE: Menambah produk baru — PROTECTED
app.post('/api/products', authenticateToken, upload.single('image'), async (req, res) => {
  console.log("POST /api/products request received!");
  console.log("Body:", req.body);
  console.log("File:", req.file);

  const { name, description, price } = req.body;
  
  let imageUrl = '';
  if (req.file) {
    imageUrl = `http://localhost:${PORT}/uploads/` + req.file.filename;
  }
  
  try {
    const newProduct = new Product({ name, description, price, imageUrl });
    await newProduct.save();
    console.log("Product saved:", newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(400).json({ message: err.message });
  }
});

// 4. UPDATE: Mengubah data produk — PROTECTED
app.put('/api/products/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { name, description, price } = req.body;
  
  const updateData = { name, description, price };
  
  if (req.file) {
    updateData.imageUrl = `http://localhost:${PORT}/uploads/` + req.file.filename;
  }
  
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. DELETE: Menghapus produk — PROTECTED
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mulai jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server backend berjalan di http://localhost:${PORT}`);
});
