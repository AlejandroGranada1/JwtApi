require('dotenv').config();
const cors = require('cors');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/users.routes.js');
const productRoutes = require('./routes/products.routes.js');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Socket.IO
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });

  socket.on('sendMessage', (msg) => {
    const name = msg?.name || 'Anónimo';
    const text = msg?.text || '';
    console.log('Mensaje recibido:', { name, text });

    io.emit('receiveMessage', { name, text });
  });
});

// Servidor
server.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en https://jwtapi-xp0m.onrender.com`);
});
