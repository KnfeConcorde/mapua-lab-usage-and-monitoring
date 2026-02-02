export const exportToExcel = (data, fileName = 'Login_History.xls') => {
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  // Create a new workbook data structure
  const ws_data = [
    ['Student Name', 'Student Number', 'Program', 'Date', 'Check-in Time']
  ]

  // Add filtered data rows
  data.forEach((entry) => {
    ws_data.push([
      entry.name,
      entry.studentNumber,
      entry.program,
      entry.date,
      entry.checkIn
    ])
  })

  // Create a simple CSV-like format and convert to Excel
  const generateXLSX = () => {
    // Using a simple approach to create Excel file without external dependency
    let xlsxContent = 'data:application/vnd.ms-excel;base64,'

    // Create XML content for Excel
    const worksheet = `<?xml version="1.0" encoding="UTF-8"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">
<Styles>
<Style ss:ID="Header" ss:Name="header">
<Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
<Font ss:Bold="1" ss:Color="#FFFFFF"/>
<Interior ss:Color="#4472C4" ss:Pattern="Solid"/>
<Borders>
<Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
<Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
<Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
<Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
</Borders>
</Style>
<Style ss:ID="Data">
<Borders>
<Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
<Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
<Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
<Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
</Borders>
</Style>
</Styles>
<Worksheet ss:Name="Log-In History">
<Table>
<Column ss:Width="150"/>
<Column ss:Width="120"/>
<Column ss:Width="180"/>
<Column ss:Width="100"/>
<Column ss:Width="120"/>
${ws_data
  .map(
    (row, idx) => `
<Row>
${row
  .map(
    (cell) => `<Cell${idx === 0 ? ' ss:StyleID="Header"' : ' ss:StyleID="Data"'}>
<Data ss:Type="String">${cell || ''}</Data>
</Cell>`
  )
  .join('')}
</Row>
`
  )
  .join('')}
</Table>
</Worksheet>
</Workbook>`

    // Encode to base64
    const encodedData = btoa(unescape(encodeURIComponent(worksheet)))

    // Create download link
    const link = document.createElement('a')
    link.href = 'data:application/vnd.ms-excel;base64,' + encodedData
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  generateXLSX()
}
