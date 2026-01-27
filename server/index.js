const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const dbFile = path.join(__dirname, 'db.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);

async function initDb() {
  await db.read();
  db.data = db.data || { sheets: [] };
  await db.write();
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const workbook = xlsx.readFile(req.file.path);
    const result = {};
    workbook.SheetNames.forEach(name => {
      const sheet = workbook.Sheets[name];
      result[name] = xlsx.utils.sheet_to_json(sheet, { defval: null });
    });

    await db.read();
    db.data = db.data || { sheets: [] };
    db.data.sheets.push({ id: Date.now(), file: req.file.originalname, data: result, uploadedAt: new Date().toISOString() });
    await db.write();

    res.json({ ok: true, stored: true, entry: db.data.sheets[db.data.sheets.length - 1] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to parse xlsx' });
  }
});

app.get('/api/data', async (req, res) => {
  await db.read();
  res.json(db.data || { sheets: [] });
});

const PORT = process.env.PORT || 5000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
});
