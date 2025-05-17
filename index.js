// index.js
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import productosRouter from './routes/productos.js';
import ventasRouter    from './routes/ventas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());

app.use('/productos', productosRouter);
app.use('/ventas', ventasRouter);

// si querés servir los JSON estáticos
app.use('/data', express.static(path.join(__dirname, 'data')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
