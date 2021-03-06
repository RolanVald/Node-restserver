const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _=require('underscore');

// requres para el modelo del usuario
const Usuario = require('../models/usuario');
//requiriendo el archivo de verificacion de token
const { verificaToken,verificaAdminRole } = require('../middlewares/autenticacion');

// ejemplo de peticion get
app.get('/usuario', verificaToken ,(req, res)=> {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado:true },'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec( (err,usuarios) =>{
            
            if( err ){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            Usuario.count({estado:true}, (err,conteo)=>{

                res.json({
                    ok:true,
                    usuarios,
                    cuantos:conteo
                });

            });

        });

});

// ejemplo de peticion post- CREAR USUARIO
app.post('/usuario', [verificaToken,verificaAdminRole] ,(req, res)=> {

    let body = req.body;

    // creacion del objeto de tipo usuario con los valores que se requieran
    let usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password,10),
        role:body.role
    });

    //
    usuario.save( (err,usurioDB)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        //usurioDB.password = null;

        res.json({
            ok:true,
            usuario:usurioDB
        });
    });
});

// ejemplo de peticion put, como para actualizar
app.put('/usuario/:id', [verificaToken,verificaAdminRole] ,(req, res)=> {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img','role','estado']);


    Usuario.findByIdAndUpdate( id, body,{new:true,runValidators:true}, (err, usurioDB)=>{
        
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            usuario:usurioDB
        });


    })

    
})

// ejemplo de peticion post
app.delete('/usuario/:id', [verificaToken,verificaAdminRole] ,(req, res)=> {
    
    let id = req.params.id;
    let cambiaEdo = {
        estado:false
    };

    Usuario.findByIdAndUpdate(id,cambiaEdo,{new:true},(err, eliminado)=>{
        
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            usuario:eliminado
        })

    });
    

})

module.exports= app;

/** 
 elimina el usuario de forma permanente

Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if( !usuarioBorrado){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            usuario:usuarioBorrado
        });

    });
*/