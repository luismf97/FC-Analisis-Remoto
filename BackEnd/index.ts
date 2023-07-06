import Server from './classes/server';
import router from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';



const server = Server.instance;

// BodyParser
server.app.use( bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }) as RequestHandler );
server.app.use( bodyParser.json({ limit: "50mb" }) as RequestHandler );

// CORS
server.app.use( cors({ origin: true, credentials: true  }) );


// Rutas de servicios
server.app.use('/', router );


server.start( () => {
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});

