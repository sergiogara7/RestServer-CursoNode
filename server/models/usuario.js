//
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

//
let Schema = mongoose.Schema;

//
let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

//
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    contrasena: {
        type: String,
        require: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    }, 
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        //require: [true, ''],
        default: true
    },
    google: {
        type: Boolean,
        //require: [true, ''],
        default: false
    }
});

//
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.contrasena;

    return userObject;
}

//
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico'})

//
module.exports = mongoose.model('Usuario', usuarioSchema);