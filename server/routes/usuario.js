//
const express = require('express')
const bcrypt = require('bcryptjs')
const _ = require('underscore')
const app = express()
const Usuario = require('../models/usuario')

//
app.get('/usuario', function (req, res) {
    //
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    //
    Usuario.find({estado: true}, 'nombre correo role estado img')
    .skip(desde)
    .limit(limite)
    .exec( (err, usuarios) => {
        //
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //
        Usuario.count({estado: true}, (err, total) => {
            return res.status(200).json({
                ok: true,
                usuarios,
                total
            })
        })
    });
})

//
app.post('/usuario', function (req, res) {
    //
    let body = req.body;
    //
    let usuario = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        contrasena: bcrypt.hashSync(body.contrasena),
        role: body.role,
    })
    //
    usuario.save((err, usuarioDB) => {
        //
        if(err){
            return res.status(400).json({
                ok: false,
                //err
                err: err.message
            })
        }
        //
        //usuarioDB.contrasena = null;
        //
        return res.status(201).json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

//
app.put('/usuario/:id', function (req, res) {
    //
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','correo','img','role','estado']);
    //
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true},(err, usuarioDB) => {
        //
        if(err){
            return res.status(400).json({
                ok: false,
                err
                //err: err.message
            })
        }
        //
        return res.status(200).json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

//
app.delete('/usuario/:id', function (req, res) {
    //
    let id = req.params.id;
    //
    /*
    Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
        //
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            })
        }
        //
        return res.status(200).json({
            ok: true,
            usuario: usuarioDB
        })
    })
    */
    Usuario.findByIdAndUpdate(id, {estado: false}, {new: true, runValidators: true},(err, usuarioDB) => {
        //
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            })
        }
        //
        return res.status(200).json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

//
module.exports = app;