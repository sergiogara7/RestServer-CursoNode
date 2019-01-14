const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());

// extensiones permitidas
let extensionesValidas = ['png','jpg','gif','jpeg'];
let tiposValidos = ['producto','usuario'];

app.put('/upload/:tipo/:id', function(req, res) {
    //
    let tipo = req.params.tipo;
    let id = req.params.id;
    //
    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El archivo no fue cargado'
            }
        });
    }

    // Validacion de tipo
    if(tiposValidos.indexOf(tipo) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + tiposValidos.join(', ')
            },
            tipo
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    //
    let nombreCortado = archivo.name.split('.');
    let extArchivo = nombreCortado[nombreCortado.length-1];

    // Validacion de extension
    if(extensionesValidas.indexOf(extArchivo) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            },
            ext: extArchivo
        })
    }

    // 
    let nombreNuevo = id + '-' + new Date().getMilliseconds() + '.' + extArchivo;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo + 's' }/${ nombreNuevo }`, function(err) {
        //
        if (err)
        return res.status(500).json({
            ok: false,
            err
        });
        // - aca imagen cargado
        if(tipo === 'usuario'){
            imagenUsuario(id, nombreNuevo, res);
        }else if(tipo === 'producto'){
            imagenProducto(id, nombreNuevo, res);
        }
        //
        /*
        res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        });
        */
    });
});

//
function imagenUsuario(id, nombre, res){

    Usuario.findById(id, (err, usuarioDB) => {
        //
        if (err){
            borrarArchivo(nombre, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //
        if(!usuarioDB){
            borrarArchivo(nombre, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }
        // borrar imagen
        borrarArchivo(usuarioDB.img, 'usuarios');
        //
        usuarioDB.img = nombre;
        //
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombre
            })
        })
    })

}
function imagenProducto(id, nombre, res){
    Producto.findById(id, (err, productoDB) => {
        //
        if (err){
            borrarArchivo(nombre, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //
        if(!productoDB){
            borrarArchivo(nombre, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }
        // borrar imagen
        borrarArchivo(productoDB.img, 'productos');
        //
        productoDB.img = nombre;
        //
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombre
            })
        })
    })
}

function borrarArchivo(nombre, tipo){
    //
    let pathImage = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombre }`);
    if(fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage);
    }
    //
}

//
module.exports = app;