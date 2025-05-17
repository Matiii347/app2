// routes/productos.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const filePath = './data/productos.json';

const loadProducts = () => JSON.parse(fs.readFileSync(filePath));

// GET: Obtener todos los productos
router.get('/', (req, res) => {
  const data = loadProducts();
  res.json(data.productos);
});

// GET: Obtener un producto por ID
router.get('/:id', (req, res) => {
  const data = loadProducts();
  const product = data.productos.find(p => p.id == req.params.id);
  product ? res.json(product) : res.status(404).send('Producto no encontrado');
});

// POST: Crear un nuevo producto
router.post('/', (req, res) => {
  const data = loadProducts();
  const nuevoProducto = { id: Date.now(), ...req.body };
  data.productos.push(nuevoProducto);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.status(201).json(nuevoProducto);
});

// POST: Buscar productos sensibles (por ejemplo, rango de precio)
router.post('/buscar', (req, res) => {
  const { minPrecio = 0, maxPrecio = Infinity } = req.body;
  const data = loadProducts();
  const resultados = data.productos.filter(p => p.precio >= minPrecio && p.precio <= maxPrecio);
  res.json(resultados);
});

// PUT: Actualizar un producto existente
router.put('/:id', (req, res) => {
  const data = loadProducts();
  const index = data.productos.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    data.productos[index] = { ...data.productos[index], ...req.body };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json(data.productos[index]);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// DELETE: Eliminar producto solo si no está en ninguna venta
router.delete('/:id', (req, res) => {
  const ventas = JSON.parse(fs.readFileSync('./data/ventas.json'));
  const productoUsado = ventas.ventas.some(v =>
    v.productos.some(p => p.id == req.params.id)
  );
  if (productoUsado) {
    return res.status(400).send('No se puede eliminar el producto porque está asociado a una venta');
  }

  const data = loadProducts();
  const nuevos = data.productos.filter(p => p.id != req.params.id);
  if (nuevos.length === data.productos.length) {
    return res.status(404).send('Producto no encontrado');
  }

  fs.writeFileSync(filePath, JSON.stringify({ productos: nuevos }, null, 2));
  res.send('Producto eliminado');
});

module.exports = router;