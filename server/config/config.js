

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
    urlDB = 'mongodb://cafe-rol:quesadilla33@ds245901.mlab.com:45901/r_cafe';
}

process.env.URLDB = urlDB;



