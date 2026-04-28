const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'teamonerisk.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      service TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/inquiry', (req, res) => {
  const { name, email, phone, company, service, message } = req.body;

  if (!name || !email || !service || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please fill all required fields.'
    });
  }

  const sql = `
    INSERT INTO inquiries (name, email, phone, company, service, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, email, phone || '', company || '', service, message], function onInsert(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Unable to submit inquiry at this time.'
      });
    }

    return res.status(201).json({
      success: true,
      id: this.lastID,
      message: 'Inquiry submitted successfully. Our team will contact you soon.'
    });
  });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  const sql = 'INSERT INTO newsletter_subscribers (email) VALUES (?)';
  db.run(sql, [email], (err) => {
    if (err) {
      if (String(err.message).includes('UNIQUE')) {
        return res.status(409).json({ success: false, message: 'This email is already subscribed.' });
      }
      return res.status(500).json({ success: false, message: 'Failed to subscribe.' });
    }

    return res.status(201).json({ success: true, message: 'Subscribed successfully!' });
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Team One Risk website API running.' });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
