const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// 
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res)=>{

    let tipo = req.params.tipo;
    let id = req.params.id;

    if( !req.files){
        return res.status(400).json({
           ok:false,
           err:{
               message:'No se ha seleccionado ningun archivo'
           } 
        });
    }

    // validacion del tipo de la imagen
    let tiposVaidos = ['productos','usuarios'];

    if( tiposVaidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Los tipos permitidas son '+ tiposVaidos.join(',')
            }
        });
    }

    let archivo = req.files.archivo;
    let archivoFrag = archivo.name.split('.');
    let extension = archivoFrag[archivoFrag.length -1];

    // extensiones permitidas
    let extensionValidas = ['png','jpg','gif','jpeg'];

    if( extensionValidas.indexOf( extension )<0 ){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Las extensiones permitidas son '+ extensionValidas.join(',')
            }
        })
    }
    

    // cambiando el nombre del archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // parte donde se sube la imagen
    archivo.mv(`uploads/${tipo}/${ nombreArchivo }`, (err,archivo)=>{
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        
        // dependiendo del tipo se ejecuta la funcion necesaria
        if(tipo === 'usuarios'){
            imagenUsuario(id,res,nombreArchivo);
        }else
            imagenProducto(id,res,nombreArchivo);

        
    });
});

// funcion que borra la imagen de un usuario o producto
// si es que existe
function borraArchivo(nombreImagen,tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen }`);

        if( fs.existsSync(pathImagen) ){
            fs.unlinkSync(pathImagen);
        }
}

// funcion para agregar la imagen a los productos 
// en la base de datos
function imagenProducto(id,res,nombreArchivo) {

    Producto.findById(id, (err, productoDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        // si no existe el producto
        if (!productoDB) {

            borraArchivo(nombreArchivo,'productos');

            return res.status(500).json({
                ok: false,
                err:{
                    message: 'El producto no existe dentro de los registros'
                }
            });
        }

        borraArchivo(productoDB.img,'productos');

        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoGuardado)=>{
            res.json({
                ok:true,
                producto: productoGuardado,
                img:nombreArchivo
            })
        });

    });

}

// funcion que agrega la imagen al usuario
// en la base de datos
function imagenUsuario(id,res, nombreArchivo) {
    
    Usuario.findById(id, (err, usuarioBD)=>{

        if(err){

            borraArchivo(nombreArchivo,'usuarios');

            return res.status(500).json({
                ok:false,
                err
            });
        }
        // si el usuario no existe
        if (!usuarioBD) {

            borraArchivo(usuarioBD.img,'usuarios');

            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no existe'
                }
            });
        }


        borraArchivo(usuarioBD.img,'usuarios');



        usuarioBD.img = nombreArchivo;

        usuarioBD.save( (err, usuarioGuardado)=>{
            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img:nombreArchivo
            })
        });
        
    });

}

module.exports = app;