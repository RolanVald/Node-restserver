const express = require('express');
const app = express();


// para usar las rutas de usuario
app.use(require('./usuario'));

// para las rutas del login
app.use(require('./login'));


module.exports = app;