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

const TIME_GROUPS = {
  Morning: ['7:00-8:00', '8:00-9:00', '9:00-10:00', '10:00-11:00'],
  Midday: ['11:00-12:00', '12:00-1:00', '1:00-2:00'],
  Afternoon: ['2:00-3:00', '3:00-4:00', '4:00-5:00', '5:00-6:00'],
  Evening: ['6:00-7:00', '7:00-8:00', '8:00-9:00']
}

export default function PieChartAnalytics() {
  const [analytics, setAnalytics] = useState([])
  const [timeUsage, setTimeUsage] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/analytics')
      .then(res => res.json())
      .then(setAnalytics)
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/time-usage')
      .then(res => res.json())
      .then(setTimeUsage)
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
            <Tooltip />
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
