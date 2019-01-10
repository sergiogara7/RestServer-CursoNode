//
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = express()
const Usuario = require('../models/usuario')

//
app.post('/login', function (req, res) {
    //
    let body = req.body;
    //
    Usuario.findOne({correo: body.correo}, (err, usuarioDB) => {
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
        if(!bcrypt.compareSync(body.contrasena, usuarioDB.contrasena)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'contraseña no valida'
                }
            })
        }
        //
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED,{ expiresIn: process.env.CADUCIDAD_TOKEN })
        //
        return res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    });
});

//
module.exports = app;