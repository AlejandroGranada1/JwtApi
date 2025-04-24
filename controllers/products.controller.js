const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
    const { name, description, price } = req.body;

    try {
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
            },
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto', error });
    }
};

// Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error });
    }
};

// Actualizar producto por ID
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    try {
        const updated = await prisma.product.update({
            where: { id: parseInt(id) },
            data: { name, description, price: parseFloat(price) },
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error });
    }
};

// Eliminar producto por ID
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.product.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error });
    }
};

//Obtener producto por ID
const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener producto', error });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
