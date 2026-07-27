const mongoose = require('mongoose');
const Product = require('./models/Product');

// Koneksi ke MongoDB lokal
mongoose.connect('mongodb://127.0.0.1:27017/toko-online-sederhana')
  .then(() => console.log('Terhubung ke MongoDB untuk seeding...'))
  .catch((err) => console.error(err));

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

const seedDatabase = async () => {
  try {
    // Hapus data lama (opsional) agar tidak duplikat jika dijalankan berkali-kali
    await Product.deleteMany();
    console.log("Data lama dihapus.");
    
    // Masukkan data baru
    await Product.insertMany(dummyProducts);
    console.log("Data dummy berhasil ditambahkan!");
    
    process.exit(0);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    process.exit(1);
  }
};

seedDatabase();
