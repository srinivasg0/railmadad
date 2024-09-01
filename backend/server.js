const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 8081;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: 'root@123', // replace with your MySQL password
  database: 'railmadad', // replace with your MySQL database name
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected.');
});

// Endpoint to handle form submissions and file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  const { pnr } = req.body;
  const file = req.file;

  if (!pnr || !file) {
    return res.status(400).json({ message: 'PNR number and file are required.' });
  }

  // Insert PNR and file details into MySQL
  const sql = 'INSERT INTO uploads (pnr, file_path) VALUES (?, ?)';
  db.query(sql, [pnr, file.path], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database insertion failed.' });
    }
    res.status(200).json({ message: 'File uploaded successfully!' });
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
