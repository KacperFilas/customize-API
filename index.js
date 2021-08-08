const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 80;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const rawdata = fs.readFileSync('data.json');

  const data = JSON.parse(rawdata);

  res.status(200).send(data);
});

app.post('/material', (req, res) => {
  const materials = req.body.currentColors;
  const img = req.body.url;
  if (!materials) {
    res.status(418).send({ messega: 'We need materials' });
  } else {
    const id = '_' + Math.random().toString(36).substr(2, 9);

    const rawdata = fs.readFileSync('data.json');
    const data = JSON.parse(rawdata);
    const ojbWithId = { id: id, materials, img };

    const arr = [...data, ojbWithId];
    res.send(arr);
    fs.writeFile('data.json', JSON.stringify(arr), 'utf8', (err) => {
      if (err) {
        throw err;
      }
    });
  }
});

app.patch('/material', (req, res) => {
  const obj = req.body;
  const rawdata = fs.readFileSync('data.json');
  const data = JSON.parse(rawdata);

  data.map((Element) => {
    if (Element.id === obj.id) {
      Element.materials = obj.materials;
      Element.img = obj.img;
    }
  });
  fs.writeFile('data.json', JSON.stringify(data), 'utf8', (err) => {
    if (err) {
      throw err;
    }
  });

  res.send(data);
});

app.listen(PORT, () => {
  console.log(`ITS LIVE at http://localhost:${PORT}`);
});
