// configuraciones para la aplicacion
require('./config/config');
//express
const express = require('express');
//mongoose
const mongoose = require('mongoose');
//body parser
const bodyParser = require('body-parser');


const app = express();




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.use(require('./routes/usuario'));



// conexion a la base de datos
mongoose.connect(process.env.URLDB, ( err ) =>{
    if( err ){
        throw err;
    }
    else{
        console.log('Base de datos online');
    }
});












app.listen(process.env.PORT, ()=>{
    console.log('Escuchando puerto: ',process.env.PORT);
});