
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

// obtener el schema
let Schema = mongoose.Schema;

// declarando un schema nuevo
let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email:{
        type: String,
        required: [true,'El correo es necesario'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'La contraseña es obligaria']
    },
    img:{
        type:String,
        required:false
    },role:{
        type:String,
        default:'USER_ROLE',
        enum: rolesValidos

    },estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObj = user.toObject();

    delete userObj.password;

    return userObj;
}

usuarioSchema.plugin( uniqueValidator, {
    message: '{PATH} debe ser unico'
});

module.exports = mongoose.model( 'Usuario',usuarioSchema);