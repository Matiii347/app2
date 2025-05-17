// routes/ventas.js
import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router    = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const filePath   = path.join(__dirname, '../data/ventas.json');

const loadSales = () =>
  JSON.parse(fs.readFileSync(filePath, 'utf8')); // devuelve un array

// GET: todas las ventas
router.get('/', (req, res) => {
  const ventas = loadSales();
  res.json(ventas);
});

// GET: venta por ID
router.get('/:id', (req, res) => {
  const ventas = loadSales();
  const venta = ventas.find(v => v.id == req.params.id);
  venta
    ? res.json(venta)
    : res.status(404).send('Venta no encontrada');
});

// POST: crear venta
router.post('/', (req, res) => {
  const ventas = loadSales();         // ventas = [ … ]
  const ultimoId = ventas.length
    ? Math.max(...ventas.map(v => v.id))
    : 0;
  const nueva = { id: ultimoId+1, fecha: new Date().toISOString(), ...req.body };
  ventas.push(nueva);
  fs.writeFileSync(filePath, JSON.stringify(ventas, null, 2));
  res.status(201).json(nueva);
});

// POST: ventas por usuario
router.post('/por-usuario', (req, res) => {
  const ventas = loadSales();                           // ya es array
  const { id_usuario } = req.body;
  const ventasUsuario = ventas.filter(v => v.id_usuario == id_usuario);
  res.json(ventasUsuario);
});

// PUT: actualizar venta
router.put('/:id', (req, res) => {
  const ventas = loadSales();         // ventas = [ … ]
  const idx = ventas.findIndex(v => v.id == req.params.id);
  if (idx === -1) return res.status(404).send('Venta no encontrada');
  ventas[idx] = { ...ventas[idx], ...req.body };
  fs.writeFileSync(filePath, JSON.stringify(ventas, null, 2));
  res.json(ventas[idx]);
});

export default router;
