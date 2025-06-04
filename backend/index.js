const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const filePath = './scouting-data.xlsx';
const workbook = new ExcelJS.Workbook();

async function loadWorkbook() {
  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
  } else {
    const sheet = workbook.addWorksheet('ScoutingData');
    // Add Timestamp column
    sheet.addRow(['Scouter Name', 'Team Number', 'Auto Notes', 'Teleop Notes', 'Endgame Notes', 'Timestamp']);
    await workbook.xlsx.writeFile(filePath);
  }
}

app.post('/submit', async (req, res) => {
  try {
    await loadWorkbook();
    const sheet = workbook.getWorksheet('ScoutingData');
    const data = req.body;

    // Get current timestamp
    const timestamp = new Date().toISOString(); // ISO string format, e.g. 2025-06-04T14:52:30.000Z

    sheet.addRow([
      data.scouterName,
      data.teamNumber,
      data.autoNotes,
      data.teleopNotes,
      data.endgameNotes,
      timestamp,
    ]);
    await workbook.xlsx.writeFile(filePath);
    res.status(200).send({ message: 'Data saved to Excel file' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to save data' });
  }
});


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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
