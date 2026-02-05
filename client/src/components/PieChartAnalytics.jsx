import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'
import { useEffect, useState } from 'react'
import './PieChartAnalytics.css'

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6'
]

const MONTHS = [
  'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan',
  'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'
]

// Updated to use 24-hour format to match backend
const TIME_GROUPS = {
  Morning: ['7:00-8:00', '8:00-9:00', '9:00-10:00', '10:00-11:00'],
  Midday: ['11:00-12:00', '12:00-13:00', '13:00-14:00'],
  Afternoon: ['14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'],
  Evening: ['18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00']
}

// Helper function to convert 24h time to 12h AM/PM format
function formatTimeTo12Hour(time24) {
  const [start, end] = time24.split('-');
  
  const formatHour = (hourStr) => {
    const hour = parseInt(hourStr.split(':')[0]);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:00 ${period}`;
  };
  
  return `${formatHour(start)} - ${formatHour(end)}`;
}

export default function PieChartAnalytics() {
  const [analytics, setAnalytics] = useState([])
  const [timeUsage, setTimeUsage] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/analytics')
      .then(res => res.json())
      .then(data => {
        console.log('Analytics data:', data);
        setAnalytics(data);
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/time-usage')
      .then(res => res.json())
      .then(data => {
        console.log('Time usage data:', data);
        setTimeUsage(data);
      })
      .catch(console.error)
  }, [])

  const totalRow = analytics.find(
    row => row.program?.toLowerCase() === 'total'
  )

  const totalYearlyVisits = totalRow?.total || 0

  const avgMonthlyVisits = totalYearlyVisits
    ? Math.round(totalYearlyVisits / 12)
    : 0

  const lineData = totalRow
    ? MONTHS.map((month, i) => ({
        month,
        students: totalRow.monthlyValues[i] || 0
      }))
    : []

  const pieData = Object.entries(TIME_GROUPS).map(
    ([group, ranges]) => {
      const total = timeUsage
        .filter(t => ranges.includes(t.time))
        .reduce((sum, t) => sum + t.total, 0)

      console.log(`${group}: matched ${total} entries from ranges`, ranges);

      return {
        name: group,
        value: total
      }
    }
  )

  const topProgram = analytics
    .filter(
      r => r.program && r.program.toLowerCase() !== 'total'
    )
    .reduce(
      (max, p) => (p.total > max.total ? p : max),
      { total: 0 }
    )

  const stats = [
    {
      label: 'Top Program',
      value: topProgram.program || 'N/A',
      color: '#3b82f6'
    },
    {
      label: 'Total Yearly Visits',
      value: totalYearlyVisits,
      color: '#10b981'
    },
    {
      label: 'Avg. Monthly Visits',
      value: avgMonthlyVisits,
      color: '#f59e0b'
    }
  ]

  // Custom tooltip to show time in 12-hour format
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
          <p style={{ margin: '5px 0 0 0' }}>{data.value} visits</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pie-chart-container">
      <div className="line-chart-wrapper">
        <h3>Monthly Library Usage (Academic Year)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="students"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="pie-chart-wrapper">
        <h3>Library Usage by Time of Day</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(1)}%`
              }
            >
              {pieData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div
              className="stat-color"
              style={{ backgroundColor: stat.color }}
            />
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}