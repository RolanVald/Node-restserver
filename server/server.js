require('./config/config');

const express = require('express');
const app = express();

//body parser
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


// -----------------------------------------------


// ejemplo de peticion get
app.get('/usuario', (req, res)=> {
    res.send('ge tUsuario');
})

// ejemplo de peticion post
app.post('/usuario', (req, res)=> {

    let body = req.body;

    // si no esta incluido el  nombre, se manda un stautus 400
    if( body.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    }else{
        res.json({
            persona:body
        });
    }

})

// ejemplo de peticion put, como para actualizar
app.put('/usuario/:id', (req, res)=> {

    let id = req.params.id;

    res.json({
        id
    });
})

// ejemplo de peticion post
app.delete('/usuario', (req, res)=> {
    res.send('delete Usuario');
})















app.listen(process.env.PORT, ()=>{
    console.log('Escuchando puerto: ',process.env.PORT);
});