const express = require('express');
const router = express.Router();
const fs = require('fs');
const filePath = './data/ventas.json';

const loadSales = () => JSON.parse(fs.readFileSync(filePath));

// GET: Obtener todas las ventas
router.get('/', (req, res) => {
  const data = loadSales();
  res.json(data.ventas);
});

// GET: Obtener una venta por ID
router.get('/:id', (req, res) => {
  const data = loadSales();
  const sale = data.ventas.find(v => v.id == req.params.id);
  sale ? res.json(sale) : res.status(404).send('Venta no encontrada');
});

// POST: Crear una nueva venta
router.post('/', (req, res) => {
  const data = loadSales();
  const nuevaVenta = { id: Date.now(), fecha: new Date().toISOString(), ...req.body };
  data.ventas.push(nuevaVenta);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.status(201).json(nuevaVenta);
});

// POST: Consultar ventas por usuario (parámetro sensible en body)
router.post('/por-usuario', (req, res) => {
  const { id_usuario } = req.body;
  const data = loadSales();
  const ventasUsuario = data.ventas.filter(v => v.id_usuario == id_usuario);
  res.json(ventasUsuario);
});

// PUT: Actualizar una venta existente
router.put('/:id', (req, res) => {
  const data = loadSales();
  const index = data.ventas.findIndex(v => v.id == req.params.id);
  if (index !== -1) {
    data.ventas[index] = { ...data.ventas[index], ...req.body };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json(data.ventas[index]);
  } else {
    res.status(404).send('Venta no encontrada');
  }
});

module.exports = router;
