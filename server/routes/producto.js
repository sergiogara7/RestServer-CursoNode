//
const express = require('express')
const _ = require('underscore')
const app = express()
const Producto = require('../models/producto')
//
const { verificaToken, verificaRoleAdmin } =  require('../middlewares/autenticacion');

//
app.get('/producto', verificaToken, function (req, res) {
    //
    Producto.find({ disponible: true })
    .sort('nombre')
    .populate('usuario','nombre')
    .populate('categoria','descripcion')
    .exec( (err, productos) => {
        //
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //
        Producto.countDocuments((err, total) => {
            return res.status(200).json({
                ok: true,
                productos,
                total
            })
        })
    });
})

//
app.post('/producto', verificaToken, function (req, res) {
    //
    let body = req.body;
    //
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id,
    })
    //
    producto.save((err, productoDB) => {
        //
        if(err){
            return res.status(400).json({
                ok: false,
                err: err.message
            })
        }
        //
        return res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
})

//
app.put('/producto/:id', verificaToken, function (req, res) {
    //
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','precioUni','descripcion','categoria']); // organizar arreglo solo con los campos definidos
    //
    Producto.findById(id, (err, productoDB) => {
        //
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }
            })
        }
        //
        productoDB.nombre = body.nombre || productoDB.nombre;
        productoDB.precioUni = body.precioUni || productoDB.precioUni;
        productoDB.descripcion = body.descripcion || productoDB.descripcion;
        productoDB.categoria = body.categoria || productoDB.categoria;
        //
        productoDB.save((err, productoDB) => {
            //
            if(err){
                return res.status(400).json({
                    ok: false,
                    err: err.message
                })
            }
            //
            return res.status(200).json({
                ok: true,
                producto: productoDB
            })
        })
    });
})

//
app.delete('/producto/:id', [verificaToken, verificaRoleAdmin], function (req, res) {
    //
    let id = req.params.id;
    //
    Producto.findByIdAndUpdate(id, { disponible: false },  {new: true, runValidators: true}, (err, productoDB) => {
        //
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no encontrada'
                }
            })
        }
        //
        return res.status(200).json({
            ok: true,
            producto: productoDB
        })
    })
})

//
module.exports = app;