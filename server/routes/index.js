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

// para las rutas de uploads
app.use(require('./ulpload'));

// para las rutas de imagenes
app.use(require('./imagenes'));




module.exports = app;