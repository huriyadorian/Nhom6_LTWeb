const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'src', 'database.json');

app.use(cors());
app.use(express.json());

// Đọc database.json
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

// Ghi vào database.json
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');

// GET /api/books — lấy toàn bộ sách
app.get('/api/books', (req, res) => {
  const db = readDB();
  res.json(db.books);
});

// POST /api/books — thêm sách mới
app.post('/api/books', (req, res) => {
  const db = readDB();
  const newBook = {
    ...req.body,
    id: db.books.length > 0 ? Math.max(...db.books.map(b => b.id)) + 1 : 1,
  };
  db.books.push(newBook);
  writeDB(db);
  res.status(201).json(newBook);
});

// PUT /api/books/:id — cập nhật sách
app.put('/api/books/:id', (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const idx = db.books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy sách' });
  db.books[idx] = { ...db.books[idx], ...req.body, id };
  writeDB(db);
  res.json(db.books[idx]);
});

// DELETE /api/books/:id — xóa sách
app.delete('/api/books/:id', (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const idx = db.books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy sách' });
  db.books.splice(idx, 1);
  writeDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Backend server đang chạy tại http://localhost:${PORT}`);
});
