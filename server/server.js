const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Storage for uploaded data
let storedData = null;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Helper function to convert Excel date serial to JS Date
function excelDateToJSDate(serial) {
  if (typeof serial !== 'number') return null;
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info;
}

// Helper function to format date as YYYY-MM-DD
function formatDate(dateValue) {
  if (!dateValue) return '';
  
  let date;
  
  if (typeof dateValue === 'number') {
    date = excelDateToJSDate(dateValue);
  } 
  else if (dateValue instanceof Date) {
    date = dateValue;
  }
  else if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  }
  
  if (!date || isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Helper function to format time
function formatTime(timeValue) {
  if (!timeValue) return '';
  
  // Handle Excel decimal time
  if (typeof timeValue === 'number') {
    const totalMinutes = Math.round(timeValue * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }
  
  // Handle string format
  if (typeof timeValue === 'string') {
    // Already formatted like "2:35 PM"
    if (timeValue.includes('AM') || timeValue.includes('PM')) {
      return timeValue;
    }
    
    // 24-hour format like "14:35"
    const match = timeValue.match(/^(\d{1,2}):(\d{2})/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
      
      return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
    }
  }
  
  return String(timeValue);
}

// Helper function to parse time to hour for analytics
function parseTimeToHour(timeString) {
  if (!timeString) {
    console.log('Empty time string');
    return null;
  }
  
  // Handle Excel decimal time
  if (typeof timeString === 'number') {
    const hours = Math.floor(timeString * 24);
    console.log(`Parsed Excel time ${timeString} -> hour ${hours}`);
    return hours;
  }
  
  // Handle string format
  if (typeof timeString === 'string') {
    // Try 24-hour format first (e.g., "19:42", "16:16", "14:35")
    const match24 = timeString.match(/^(\d{1,2}):(\d{2})/);
    if (match24) {
      const hour = parseInt(match24[1]);
      console.log(`Parsed 24h time ${timeString} -> hour ${hour}`);
      return hour;
    }
    
    // Try 12-hour format with AM/PM (e.g., "2:35 PM", "9:42 AM")
    const match12 = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match12) {
      let hours = parseInt(match12[1]);
      const period = match12[3].toUpperCase();
      
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      console.log(`Parsed 12h time ${timeString} -> hour ${hours}`);
      return hours;
    }
  }
  
  console.log(`Could not parse time: ${timeString} (type: ${typeof timeString})`);
  return null;
}

// Helper function to get time range string
function getTimeRange(hour) {
  if (hour === null || hour < 0 || hour >= 24) return null;
  const nextHour = hour + 1;
  return `${hour}:00-${nextHour}:00`;
}

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📁 File received:', req.file.originalname);

    // Read the Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Store the data
    storedData = {
      filename: req.file.originalname,
      uploadedAt: new Date().toISOString(),
      rowCount: data.length,
      data: data
    };

    // Delete the temporary uploaded file
    fs.unlinkSync(req.file.path);

    console.log(`✅ Successfully processed ${data.length} rows`);

    res.json({
      message: 'File uploaded successfully',
      rowCount: data.length,
      preview: data.slice(0, 5)
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all stored data
app.get('/api/data', (req, res) => {
  try {
    if (!storedData) {
      return res.status(404).json({ 
        error: 'No data available',
        message: 'Please upload an Excel file first' 
      });
    }
    res.json(storedData);
  } catch (error) {
    console.error('❌ Fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Dashboard logs endpoint - with formatted date and time
app.get('/api/dashboard/logs', (req, res) => {
  try {
    if (!storedData || !storedData.data) {
      console.log('⚠️  No data available for dashboard');
      return res.json([]);
    }

    // Format the data for display
    const formattedLogs = storedData.data.map(log => ({
      ID: log.ID || log['Student Number'] || '',
      Name: log.Name || '',
      Program: log.Program || '',
      date: formatDate(log.Date),
      checkInTime: formatTime(log['Time In']),
      Year: log.Year || '',
      // Keep original data for reference
      _originalDate: log.Date,
      _originalTime: log['Time In']
    }));

    console.log(`📊 Sending ${formattedLogs.length} formatted logs to dashboard`);
    res.json(formattedLogs);
  } catch (error) {
    console.error('❌ Dashboard logs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analytics endpoint - program statistics by month
app.get('/api/dashboard/analytics', (req, res) => {
  try {
    if (!storedData || !storedData.data) {
      return res.json([]);
    }

    const data = storedData.data;
    
    // Count by program and month
    const programStats = {};
    
    data.forEach(row => {
      const program = row.Program || 'Unknown';
      const dateValue = row.Date;
      
      if (!programStats[program]) {
        programStats[program] = {
          program: program,
          total: 0,
          monthlyValues: new Array(12).fill(0) // Aug=0, Sep=1, ..., Jul=11
        };
      }
      
      programStats[program].total++;
      
      // Parse date and increment the appropriate month
      if (dateValue) {
        let date;
        if (typeof dateValue === 'number') {
          date = excelDateToJSDate(dateValue);
        } else {
          date = new Date(dateValue);
        }
        
        if (date && !isNaN(date.getTime())) {
          const month = date.getMonth(); // 0-11 (Jan=0, Feb=1, etc.)
          // Adjust for academic year (Aug=0, Sep=1, ..., Jul=11)
          const academicMonth = month >= 7 ? month - 7 : month + 5;
          programStats[program].monthlyValues[academicMonth]++;
        }
      }
    });

    // Calculate totals across all programs
    const totalStats = {
      program: 'Total',
      total: data.length,
      monthlyValues: new Array(12).fill(0)
    };

    Object.values(programStats).forEach(stat => {
      stat.monthlyValues.forEach((val, idx) => {
        totalStats.monthlyValues[idx] += val;
      });
    });

    const result = [...Object.values(programStats), totalStats];
    
    console.log(`📊 Sending analytics for ${Object.keys(programStats).length} programs`);
    res.json(result);

  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Time usage endpoint - usage by hour of day
app.get('/api/dashboard/time-usage', (req, res) => {
  try {
    if (!storedData || !storedData.data) {
      return res.json([]);
    }

    const data = storedData.data;
    
    console.log('\n📊 Processing time usage data...');
    
    // Count visits by hour
    const timeStats = {};
    
    data.forEach((row, index) => {
      const timeIn = row['Time In'];
      console.log(`Row ${index + 1}: Time In = ${timeIn} (type: ${typeof timeIn})`);
      
      const hour = parseTimeToHour(timeIn);
      
      if (hour !== null) {
        const timeRange = getTimeRange(hour);
        
        if (timeRange) {
          if (!timeStats[timeRange]) {
            timeStats[timeRange] = {
              time: timeRange,
              total: 0
            };
          }
          timeStats[timeRange].total++;
          console.log(`  ✓ Added to range ${timeRange} (total now: ${timeStats[timeRange].total})`);
        }
      }
    });

    const result = Object.values(timeStats).sort((a, b) => {
      const hourA = parseInt(a.time.split(':')[0]);
      const hourB = parseInt(b.time.split(':')[0]);
      return hourA - hourB;
    });
    
    console.log(`\n✅ Sending time usage data for ${result.length} time slots:`);
    result.forEach(slot => {
      console.log(`   ${slot.time}: ${slot.total} visits`);
    });
    
    res.json(result);

  } catch (error) {
    console.error('❌ Time usage error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    dataLoaded: storedData !== null,
    rowCount: storedData ? storedData.rowCount : 0
  });
});

app.listen(PORT, () => {
  console.log(`
🚀 Server running on http://localhost:${PORT}
📡 Available endpoints:
   - POST http://localhost:${PORT}/api/upload
   - GET  http://localhost:${PORT}/api/data
   - GET  http://localhost:${PORT}/api/dashboard/logs
   - GET  http://localhost:${PORT}/api/dashboard/analytics
   - GET  http://localhost:${PORT}/api/dashboard/time-usage
   - GET  http://localhost:${PORT}/api/health
  `);
});