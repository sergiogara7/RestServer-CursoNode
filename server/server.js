//
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const path = require('path')

//
const app = express()

// -- cargar variables configuracion
require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// rutas
app.use(require('./routes/index'));

//
mongoose.connect(process.env.URLDB, {useNewUrlParser :  true, useCreateIndex: true }, (err, res) => {
    if( err ) throw err;
    console.log('DB online en puerto: 27017');
})

//
app.listen(process.env.PORT, () => {
    console.log('escuchando el puerto: ' + process.env.PORT)
})