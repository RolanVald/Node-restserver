

// ===================================
//  Puerto 
// ===================================

process.env.PORT = process.env.PORT || 3000;

// ===================================
//  Entorno 
// ===================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===================================
//  Base de datos 
// ===================================

let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URLI;
}

process.env.URLDB = urlDB;

// ===================================
//  vencimiento
// ===================================
// 60 seg
// 60 min
// 24 hrs
// 30 dias

process.env.CADUCIDAD_TOKEN = '48h';


// ===================================
//  seed
// ===================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

// ===================================
//  Google clientID
// ===================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '796685908898-rko9rcfspj4mj9hr8tcvdh2e3fe0onf1.apps.googleusercontent.com';