//
const express = require('express')
const _ = require('underscore')
const app = express()
const Categoria = require('../models/categoria')
//
const { verificaToken, verificaRoleAdmin } =  require('../middlewares/autenticacion');

//
app.get('/categoria', verificaToken, function (req, res) {
    //
    Categoria.find()
    .sort('descripcion')
    .populate('usuario','nombre')
    .exec( (err, categorias) => {
        //
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //
        Categoria.countDocuments((err, total) => {
            return res.status(200).json({
                ok: true,
                categorias,
                total
            })
        })
    });
})

//
app.post('/categoria', verificaToken, function (req, res) {
    //
    let body = req.body;
    //
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    })
    //
    categoria.save((err, categoriaDB) => {
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
            categoria: categoriaDB
        })
    })
})

//
app.put('/categoria/:id', verificaToken, function (req, res) {
    //
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']); // organizar arreglo solo con los campos definidos
    //
    Categoria.findById(id, (err, categoriaDB) => {
        //
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }
            })
        }
        //
        categoriaDB.descripcion = body.descripcion;
        //
        categoriaDB.save((err, categoriaDB) => {
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
                categoria: categoriaDB
            })
        })
    });
})

//
app.delete('/categoria/:id', [verificaToken, verificaRoleAdmin], function (req, res) {
    //
    let id = req.params.id;
    //
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        //
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }
            })
        }
        //
        return res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

//
module.exports = app;