require('dotenv').config();
const express = require('express');
const app = express();

const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/users.routes.js');
const productRoutes = require('./routes/products.routes.js');


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products', productRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});
