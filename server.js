const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Rota para o JSON
app.get('/data.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data.json'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});