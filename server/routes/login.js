//
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
const {OAuth2Client} = require('google-auth-library');

//
const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Config Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    //console.log(payload.name, payload.email);

    // res
    return {
        nombre: payload.name,
        correo: payload.email,
        img: payload.picture,
        google: true
    }
    /*
    console.log('verificando manual');
    return {
        nombre: 'Sergio Gara',
        correo: 'sergiogara7@gmail.com',
        img: 'xxx.jpg',
        google: true
    }
    */
}

//
app.post('/google', async (req, res) => {
    //
    let token = req.body.idtoken;
    //
    let googleUser = await verify(token).catch( err => {
        return Response.status(403).json({
            ok:false,
            err
        })
    })
    //
    Usuario.findOne({ correo: googleUser.correo }, (err, usuarioDB) => {
        //
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        //
        if(usuarioDB){
            if(!usuarioDB.google){
                return res.status(400).json({
                    ok: false,
                    err: 'Usar autenticacion normal'
                })
            }else{
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
            }
        }else{
            // si el usuario no existe - se crea
            let usuario = new Usuario;
            //
            usuario.nombre = googleUser.nombre;
            usuario.correo = googleUser.correo;
            usuario.img = googleUser.img;
            usuario.google = googleUser.google;
            usuario.contrasena = '.l.';
            //
            usuario.save((err, usuarioDB) => {
                //
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                //
                if(!usuarioDB){
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'usuario no registrado'
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
            })
        }
    })
});

//
module.exports = app;