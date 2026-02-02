import './StudentDailyEntries.css';
export default function StudentDailyEntries({ logs, darkMode }) {
  return (
    <div className="entries-table-container">
      <div className="entries-scroll">
        <table className="entries-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Student Number</th>
              <th>Program</th>
              <th>Date</th>
              <th>Check-in Time</th>
            </tr>
          </thead>
          <tbody>
            {logs && logs.length > 0 ? (
              logs.map((entry) => (
                <tr key={entry.ID} className="entry-row">
                  <td className="name-cell">{entry.Name}</td>
                  <td className="student-number-cell">{entry.ID}</td>
                  <td className="program-cell">{entry.Program}</td>
                  <td className="date-cell">{entry.date}</td>
                  <td className="checkin-time-cell">{entry.checkInTime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  <p>No entries found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );z
}
