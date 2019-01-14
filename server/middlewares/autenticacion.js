// -- requires
const jwt = require('jsonwebtoken');

// -- Verificar token
let verificaToken = (req, res, next) => {
    //
    let token = req.get('token');
    //
    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        //
        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }
        //
        req.usuario = decoded.usuario;
        //
        next();
    });
};

// -- Verificar token IMG - url
let verificaTokenImg = (req, res, next) => {
    //
    let token = req.query.token;
    //
    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        //
        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }
        //
        req.usuario = decoded.usuario;
        //
        next();
    });
};

// -- Verificar token ADMIN
let verificaRoleAdmin = (req, res, next) => {
    //
    let usuario = req.usuario;
    //return res.json({ usuario })
    //
    if(usuario.role != 'ADMIN_ROLE'){
        return res.status(400).json({
            ok: false,
            err: 'El usuario deber ser un administrador'
        })
    }
    //
    next();
};

// -- export
module.exports = {
    verificaToken,
    verificaRoleAdmin,
    verificaTokenImg
}