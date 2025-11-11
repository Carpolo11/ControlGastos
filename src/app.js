// app.js
const express = require('express');
const config = require('./config');
const cors = require('cors');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const FamiliaRoutes = require ('./routes/FamiliaRoutes')
const MiemRoutes = require ('./routes/MiemRoutes')
const CategoriaRoutes = require ('./routes/CategoriaRoutes')
const transaccionRoutes = require('./routes/TransaccionRoutes');
const ReporteRoutes = require ('./routes/ReporteRoutes')
const exportacionRoutes = require('./routes/ExportacionRoutes');


const app = express();

// Configuración
app.set('port', config.app.port);
app.use(cors());
app.use(express.json());

// Usar las rutas 
app.use('/usuarios', userRoutes);
app.use('/familia', FamiliaRoutes);
app.use('/miembro_familia', MiemRoutes);
app.use('/categoria', CategoriaRoutes);
app.use('/reportes', ReporteRoutes);
app.use('/transaccion', transaccionRoutes);
app.use('/exportar', exportacionRoutes);

module.exports = app;
