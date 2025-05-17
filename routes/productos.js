// routes/productos.js
import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const filePath   = path.join(__dirname, '../data/productos.json');

const loadProducts = () =>
  JSON.parse(fs.readFileSync(filePath, 'utf8')); // ahora devuelve un array

// GET: todos los productos
router.get('/', (req, res) => {
  const productos = loadProducts();  // antes: data.productos
  res.json(productos);
});

// GET: producto por ID
router.get('/:id', (req, res) => {
  const productos = loadProducts();
  const prod = productos.find(p => p.id == req.params.id);
  prod
    ? res.json(prod)
    : res.status(404).send('Producto no encontrado');
});

// POST: crear producto
router.post('/', (req, res) => {
  const productos = loadProducts();
  const nuevo = { id: Date.now(), ...req.body };
  productos.push(nuevo);
  fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
  res.status(201).json(nuevo);
});

// POST: buscar por rango de precio
router.post('/buscar', (req, res) => {
  const { minPrecio = 0, maxPrecio = Infinity } = req.body;
  const resultados = loadProducts()
    .filter(p => p.precio >= minPrecio && p.precio <= maxPrecio);
  res.json(resultados);
});

// PUT: actualizar producto
router.put('/:id', (req, res) => {
  const productos = loadProducts();
  const idx = productos.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).send('Producto no encontrado');

  productos[idx] = { ...productos[idx], ...req.body };
  fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
  res.json(productos[idx]);
});

// DELETE: eliminar si no está en ventas
router.delete('/:id', (req, res) => {
  // cargo directamente un array
  const ventasArray = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/ventas.json'), 'utf8')
  );

  // ahora uso ventasArray directamente
  const productoUsado = ventasArray.some(v =>
    v.productos.some(p => p.id == req.params.id)
  );
  if (productoUsado) {
    return res
      .status(400)
      .send('No se puede eliminar el producto porque está en una venta');
  }
  let productos = loadProducts();
  const filtrados = productos.filter(p => p.id != req.params.id);
  if (filtrados.length === productos.length)
    return res.status(404).send('Producto no encontrado');

  fs.writeFileSync(filePath, JSON.stringify(filtrados, null, 2));
  res.send('Producto eliminado');
});

export default router;
