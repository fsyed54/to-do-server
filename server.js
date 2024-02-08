const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const jsonFilePath = 'data.json';

// GET operation
app.get('/api/data', async (req, res) => {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// POST operation
app.post('/api/data', async (req, res) => {
  try {
    const newData = req.body;
    const currentData = JSON.parse(await fs.readFile(jsonFilePath, 'utf-8'));
    currentData.push(newData);
    await fs.writeFile(jsonFilePath, JSON.stringify(currentData, null, 2));
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// PUT operation
app.put('/api/data/:id', async (req, res) => {
  try {
    const updatedData = req.body;
    const currentData = JSON.parse(await fs.readFile(jsonFilePath, 'utf-8'));
    const dataIndex = currentData.findIndex(item => item.id == req.params.id);
    if (dataIndex !== -1) {
      currentData[dataIndex] = updatedData;
      await fs.writeFile(jsonFilePath, JSON.stringify(currentData, null, 2));
      res.json(updatedData);
    } else {
      res.status(404).send('Data not found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// DELETE operation
app.delete('/api/data/:id', async (req, res) => {
  try {
    const currentData = JSON.parse(await fs.readFile(jsonFilePath, 'utf-8'));
    const newData = currentData.filter(item => item.id != req.params.id);
    await fs.writeFile(jsonFilePath, JSON.stringify(newData, null, 2));
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
