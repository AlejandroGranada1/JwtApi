const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controller.js');

const { verifyToken, isAdmin } = require('../middlewares/authMiddleware.js');

// Crear producto (solo admin)
router.post('/create', verifyToken, isAdmin, createProduct);

// Obtener todos los productos (cualquier usuario autenticado)
router.get('/', verifyToken, getAllProducts);

// Actualizar producto (solo admin)
router.put('/:id', verifyToken, isAdmin, updateProduct);

// Eliminar producto (solo admin)
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

// Obtener producto por id (cualquier usuario autenticado)
router.get('/:id', verifyToken, getProductById);

module.exports = router;
