const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'farmers.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

function getFarmers() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = [
            { id: 1, name: 'Jean Bosco', location: 'Musanze', crop: 'Ibirayi' },
            { id: 2, name: 'Aline Mukamana', location: 'Huye', crop: 'Umusaruro w\'ikawa' },
            { id: 3, name: 'Emmanuel Ndayisaba', location: 'Nyagatare', crop: 'Ibigori' }
        ];
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

app.get('/api/farmers', (req, res) => {
    const farmers = getFarmers();
    res.json({ success: true, data: farmers });
});

app.post('/api/farmers', (req, res) => {
    const farmers = getFarmers();
    const newFarmer = {
        id: farmers.length > 0 ? farmers[farmers.length - 1].id + 1 : 1,
        name: req.body.name,
        location: req.body.location,
        crop: req.body.crop
    };
    farmers.push(newFarmer);
    fs.writeFileSync(DATA_FILE, JSON.stringify(farmers, null, 2));
    res.status(201).json({
        success: true,
        message: 'Umuhinzi yongewemo neza muri Database!',
        data: newFarmer
    });
});

app.listen(PORT, () => {
    console.log('Seriveri yatangiye gukora kuri http://localhost:' + PORT);
});
