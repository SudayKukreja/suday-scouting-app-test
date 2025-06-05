const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const filePath = './scouting-data.xlsx';
const workbook = new ExcelJS.Workbook();

app.use(cors());
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Load or create Excel file
async function loadWorkbook() {
  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
  } else {
    const sheet = workbook.addWorksheet('ScoutingData');
    sheet.addRow(['Scouter Name', 'Team Number', 'Auto Notes', 'Teleop Notes', 'Endgame Notes']);
    await workbook.xlsx.writeFile(filePath);
  }
}

// Receive and store scouting data
app.post('/submit', async (req, res) => {
  try {
    await loadWorkbook();
    const sheet = workbook.getWorksheet('ScoutingData');
    const data = req.body;
    sheet.addRow([
      data.scouterName,
      data.teamNumber,
      data.autoNotes,
      data.teleopNotes,
      data.endgameNotes,
    ]);
    await workbook.xlsx.writeFile(filePath);
    res.status(200).send({ message: 'Data saved to Excel file' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to save data' });
  }
});

// Start server on local network
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running at http://192.168.1.10:${PORT}`);
});
