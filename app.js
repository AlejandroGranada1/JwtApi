require('dotenv').config();
const express = require('express');
const http = require('http');           // <--- Agregado
const socketio = require('socket.io');  // <--- Agregado

const app = express();
const server = http.createServer(app);  // <--- En vez de app.listen
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

// Socket.IO en acción 🎯
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });

  // Puedes agregar eventos aquí, por ejemplo:
  socket.on('sendMessage', (msg) => {
    console.log('Mensaje recibido:', msg);
    io.emit('receiveMessage', msg); // lo reenvías a todos
  });
});

// Servidor corriendo
server.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en https://jwtapi-xp0m.onrender.com`);
})
