const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());

app.use('/usuarios', require('./routes/usuarios'));
app.use('/productos', require('./routes/productos'));
app.use('/ventas', require('./routes/ventas'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
