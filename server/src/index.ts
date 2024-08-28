import Server from "./models/server";

import dotenv from 'dotenv';

// Configuración de dot.env
dotenv.config();


const server = new Server();

server.listen();