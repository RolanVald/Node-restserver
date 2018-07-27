
const express = require('express');
const _=require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


// crear un producto
app.post('/producto', verificaToken ,(req, res)=>{

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        categoria: body.categoria
    });


    producto.save( (err, productoBD)=>{

        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            message: 'Producto creado',
            producto: productoBD
        });

    });

});


// buscar producto
app.get('/producto/buscar/:termino', verificaToken, (req,res)=>{

    let termino = req.params.termino;
    let regex = RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria','nombre')
        .exec( (err, productos)=>{

            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                productos
            });

        });

});

// obtener todos los productos 
app.get('/producto', verificaToken ,(req, res)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find( { disponible:true }, )
        .sort('nombre')
        .populate('usuario','nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec( (err, productos)=>{

            if( err ){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            Producto.count({disponible:true}, (err, conteo)=>{

                res.json({
                    ok:true,
                    producto:productos,
                    resultados:conteo
                });

            });


        });

});


// obtener un producto por id
app.get('/producto/:id', verificaToken ,(req, res)=>{

    let id = req.params.id;

   
    //let body = req.body;

    Producto.findById(id )
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( ( err, productoDB)=>{

            if( err ){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            if( !productoDB ){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok:true,
                producto:productoDB
            });

        });




});


// actualizar un producto
app.put('/producto/:id', verificaToken ,(req, res)=>{

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','precioUni','descripcion'] );


    Producto.findByIdAndUpdate(id,body,{new:true, runValidators:true}, ( err, productoBD)=>{

        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if( !productoBD ){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'No se encontro el producto'
                }
            });
        }

        res.json({
            ok:true,
            message:'Cambios realizados correctamente',
            producto: productoBD
        });

    });

});


// eliminar un producto
app.delete('/producto/:id', verificaToken ,(req, res)=>{

    let id = req.params.id;
    let estado ={
        disponible:false
    };


    Producto.findByIdAndUpdate(id, estado, {new:true}, ( err, productoBD)=>{

        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            message: 'Producto actualizado correctamente',
            producto: productoBD
        })

    });

});












module.exports = app;