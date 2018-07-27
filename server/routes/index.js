const express = require('express');
const app = express();


// para usar las rutas de usuario
app.use(require('./usuario'));

// para las rutas del login
app.use(require('./login'));

// para usar las rutas de categoria
app.use( require('./categoria'));

// para usar las rutas de productos
app.use( require('./producto'));

module.exports = app;