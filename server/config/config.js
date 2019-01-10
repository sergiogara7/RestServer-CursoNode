// -- Puerto
process.env.PORT = process.env.PORT || 3000;

// -- Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// -- Db
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URL
}
process.env.URLDB = urlDB;

// -- caducidad 
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// -- SEED autenticacion
process.env.SEED = process.env.SEED || 'seed-dev';

// -- CLIENTE ID GOOGLE
process.env.CLIENT_ID = process.env.CLIENT_ID || '677944295391-bv7nu3q31tdg0tooirni96fo46tbdt97.apps.googleusercontent.com';