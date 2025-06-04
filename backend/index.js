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
    sheet.addRow([
      'Scouter Name',
      'Team Number',
      'Auto Points',
      'Auto Scored',
      'Auto Notes',
      'Teleop Points',
      'Teleop Scored',
      'Offense Rating',
      'Defense Rating',
      'Teleop Notes',
      'Did Park',
      'Did Climb',
      'Endgame Notes',
      'Submission Time'
    ]);
    await workbook.xlsx.writeFile(filePath);
  }
}

app.post('/submit', async (req, res) => {
  try {
    await loadWorkbook();
    const sheet = workbook.getWorksheet('ScoutingData');
    const data = req.body;

    sheet.addRow([
      data.scouterName,
      data.teamNumber,
      data.autoPoints || '',
      data.autoScored || '',
      data.autoNotes || '',
      data.teleopPoints || '',
      data.teleopScored || '',
      data.offenseRating || '',
      data.defenseRating || '',
      data.teleopNotes || '',
      data.didPark || '',
      data.didClimb || '',
      data.endgameNotes || '',
      data.submissionTime || ''
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
