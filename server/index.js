const express = require('express')
const cors = require('cors')
const multer = require('multer')
const xlsx = require('xlsx')
const path = require('path')
const fs = require('fs')
const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')

const app = express()
app.use(cors())
app.use(express.json())

const UPLOAD_DIR = path.join(__dirname, 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
})

const upload = multer({ storage })

const dbFile = path.join(__dirname, 'db.json')
const adapter = new JSONFile(dbFile)
const db = new Low(adapter)

async function initDb() {
  await db.read()
  db.data = db.data || { sheets: [] }
  await db.write()
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  try {
    const workbook = xlsx.readFile(req.file.path)
    const result = {}

    workbook.SheetNames.forEach(name => {
      result[name] = xlsx.utils.sheet_to_json(
        workbook.Sheets[name],
        { defval: null }
      )
    })

    await db.read()
    db.data = db.data || { sheets: [] }

    const entry = {
      id: Date.now(),
      file: req.file.originalname,
      data: result,
      uploadedAt: new Date().toISOString()
    }

    db.data.sheets.push(entry)
    await db.write()

    res.json({ ok: true, stored: true, entry })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to parse xlsx' })
  }
})

app.get('/api/data', async (req, res) => {
  await db.read()
  res.json(db.data || { sheets: [] })
})

app.get('/api/dashboard/analytics', async (req, res) => {
  await db.read()

  const acadSheet = (db.data.sheets || [])
    .filter(s => s.file === 'AcadYearDatasheet.xlsx')
    .sort((a, b) => b.id - a.id)[0]

  if (!acadSheet || !acadSheet.data.Sheet1) {
    return res.json([])
  }

  const rows = acadSheet.data.Sheet1.slice(1)

  const analytics = rows
    .filter(row => row['SY-2024-2025'])
    .map(row => {
      const program = row['SY-2024-2025']

      const monthlyValues = Object.entries(row)
        .filter(
          ([key, val]) =>
            key !== 'SY-2024-2025' &&
            key !== '__EMPTY_9' &&
            typeof val === 'number'
        )
        .map(([, val]) => val)

      const total =
        typeof row['__EMPTY_9'] === 'number'
          ? row['__EMPTY_9']
          : monthlyValues.reduce((a, b) => a + b, 0)

      return { program, monthlyValues, total }
    })

  res.json(analytics)
})

app.get('/api/dashboard/summary', async (req, res) => {
  await db.read()

  const logSheet = (db.data?.sheets || [])
    .filter(s => s.file === 'CurrentLogDatasheet.xlsx')
    .sort(
      (a, b) =>
        new Date(b.uploadedAt) - new Date(a.uploadedAt)
    )[0]

  if (!logSheet) {
    return res.json({
      totalLogs: 0,
      byProgram: {},
      byHour: {},
      recentLogs: []
    })
  }

  const rows = logSheet.data.Sheet1 || []
  const byProgram = {}
  const byHour = {}

  rows.forEach(r => {
    if (r.Program) {
      byProgram[r.Program] =
        (byProgram[r.Program] || 0) + 1
    }

    if (typeof r['Time In'] === 'number') {
      const hour = Math.floor(r['Time In'] * 24)
      byHour[hour] = (byHour[hour] || 0) + 1
    }
  })

  res.json({
    totalLogs: rows.length,
    byProgram,
    byHour,
    recentLogs: rows.slice(-10).reverse()
  })
})

app.get('/api/dashboard/time-usage', async (req, res) => {
  await db.read()

  const sheet = (db.data.sheets || [])
    .filter(s => s.file === 'AcadYearDatasheet.xlsx')
    .sort((a, b) => b.id - a.id)[0]

  if (!sheet || !sheet.data.Sheet1) {
    return res.json([])
  }

  const rows = sheet.data.Sheet1

  const headerRow = rows.find(row =>
    Object.values(row).some(
      v =>
        typeof v === 'string' &&
        v.trim().toUpperCase() === 'TIME'
    )
  )

  if (!headerRow) {
    return res.json([])
  }

  const timeKey = Object.keys(headerRow).find(
    k =>
      String(headerRow[k]).trim().toUpperCase() === 'TIME'
  )

  const totalKey = Object.keys(headerRow).find(
    k =>
      String(headerRow[k]).trim().toUpperCase() === 'TOTAL'
  )

  const headerIndex = rows.indexOf(headerRow)

  const dataRows = rows
    .slice(headerIndex + 1)
    .filter(r => r[timeKey] && r[timeKey] !== 'TOTAL')

  const timeUsage = dataRows.map(row => {
    const total = Object.entries(row)
      .filter(
        ([key, val]) =>
          key !== timeKey &&
          key !== totalKey &&
          typeof val === 'number'
      )
      .reduce((sum, [, val]) => sum + val, 0)

    return { time: row[timeKey], total }
  })

  res.json(timeUsage)
})

app.get('/api/dashboard/logs', async (req, res) => {
  await db.read()

  const logSheet = (db.data?.sheets || [])
    .filter(s => s.file === 'CurrentLogDatasheet.xlsx')
    .sort(
      (a, b) =>
        new Date(b.uploadedAt) - new Date(a.uploadedAt)
    )[0]

  if (!logSheet) {
    return res.json([])
  }

  res.json(logSheet.data.Sheet1 || [])
})

const PORT = process.env.PORT || 5000

initDb().then(() => {
  app.listen(PORT, () =>
    console.log(`Server listening on ${PORT}`)
  )
})
