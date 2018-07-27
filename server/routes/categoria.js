
const express = require('express');
const _=require('underscore');

let { verificaToken,verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();
let Categoria = require('../models/categoria');


// Mostrar todos las categorias
app.get( '/categoria', verificaToken ,(req, res)=>{

    Categoria.find( { }, 'descripcion usuario')
            .sort('descripcion') // indica el parametro por el cual se ordenara
            .populate('usuario','nombre email')
            .exec( (err, categorias)=>{

                if ( err ){
                    return res.status(400).json({
                        ok:false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    categorias
                });

            });
});

// Mostrar una categoria por id
app.get( '/categoria/:id', verificaToken ,(req, res)=>{

    let id = req.params.id;
    
    Categoria.findById( { _id:id },' descripcion usuario')
            .exec( (err, categoria)=>{

                if ( err ){
                    return res.status(400).json({
                        ok:false,
                        err:{
                            message: 'No se encontró la categoria'
                        }
                    });
                }

                res.json({
                    ok:true,
                    categoria
                });

            });

});

// crear una nueva categoria 
app.post('/categoria', verificaToken ,(req, res)=>{

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB)=>{
        // por si hay un erro de la base de datos
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        // por si no se crea la categoria
        if( !categoriaDB ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        });

    });

});

// actualiza una categoria
app.put( '/categoria/:id', verificaToken ,(req, res)=>{

    let id = req.params.id;
    let body = _.pick( req.body,['descripcion'] );


    Categoria.findByIdAndUpdate(id, body, {new:true, runValidators:true} ,(err, categoriaDB)=>{

                if ( err ){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }

                if( !categoriaDB ){
                    return res.status(400).json({
                        ok:false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    message: 'Categoria actualizada',
                    categoria: categoriaDB
                });

            });

});

// elimina una categoria
app.delete( '/categoria/:id', [verificaToken,verificaAdminRole] ,(req, res)=>{

    let id = req.params.id;

    Categoria.findByIdAndRemove(id,( err , categoriaElim)=>{

        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if ( !categoriaElim ){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'No hay nada que eliminar'
                }
            });
        }

        res.json({
            ok:true,
            message: 'Categoria borrada',
            categoria: categoriaElim
        });

    });

});



module.exports = app;
