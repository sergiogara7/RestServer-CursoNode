// -- Puerto
process.env.PORT = process.env.PORT || 3000;

// -- Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// -- Db
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'server'
}
process.env.URLDB = urlDB;