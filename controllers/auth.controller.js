const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Función para generar tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: 'Credenciales inválidas' });

        const { accessToken, refreshToken } = generateTokens(user);

        // Guardar el refresh token en la base de datos
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        res.json({ accessToken, refreshToken });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Refresh token
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Token requerido' });

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: 'Refresh token inválido' });
        }

        const newTokens = generateTokens(user);
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newTokens.refreshToken },
        });

        res.json(newTokens);
    } catch (err) {
        res.status(403).json({ error: 'Token inválido o expirado' });
    }
};
