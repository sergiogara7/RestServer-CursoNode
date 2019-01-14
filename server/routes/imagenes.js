const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const { verificaTokenImg } = require('../middlewares/autenticacion');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


app.get('/imagen/:tipo/:img', verificaTokenImg, function(req, res) {
    //
    let tipo = req.params.tipo;
    let img = req.params.img;
    //
    let pathImage = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    let pathNoImage = path.resolve(__dirname, '../assets/no-image.jpg');
    //
    if(fs.existsSync(pathImage)){
        res.sendFile(pathImage);
    }else{
        res.sendFile(pathNoImage);
    }
});

//
module.exports = app;