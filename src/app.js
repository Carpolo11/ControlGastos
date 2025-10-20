// app.js
const express = require('express');
const config = require('./config');
const cors = require('cors');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const FamiliaRoutes = require ('./routes/FamiliaRoutes')
const MiemRoutes = require ('./routes/MiemRoutes')


const app = express();

// Configuración
app.set('port', config.app.port);
app.use(cors());
app.use(express.json());

// Usar las rutas de usuarios
app.use('/usuarios', userRoutes);
app.use('/familia', FamiliaRoutes);
app.use('/miembro_familia', MiemRoutes);

module.exports = app;
