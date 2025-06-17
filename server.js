const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Koneksi ke database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Koneksi database gagal:', err);
    return;
  }
  console.log('Terhubung ke database MySQL!');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Route login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).send('Terjadi kesalahan server.');
    }

    // Cek apakah user ditemukan
    if (results.length > 0) {
      res.send(`
        <h2 style="color:green">Login berhasil!</h2>
        <p>Selamat datang, ${username}</p>
      `);
    } else {
      res.send(`
        <h2 style="color:red">Login gagal!</h2>
        <p>Username atau password salah. Silakan coba lagi.</p>
        <a href="/">Kembali ke halaman login</a>
      `);
    }
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
