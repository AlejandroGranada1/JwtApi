const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Registro de usuario
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role },
        });
        res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (err) {
        res.status(400).json({ error: 'El correo ya existe o datos inválidos' });
    }
};

// Obtener todos los usuarios
exports.getAll = async (req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json(users);
};
