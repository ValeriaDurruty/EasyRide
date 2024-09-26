"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const charter_routes_1 = __importDefault(require("../routes/charter.routes"));
const viaje_routes_1 = __importDefault(require("../routes/viaje.routes"));
const provincia_routes_1 = __importDefault(require("../routes/provincia.routes"));
const localidad_routes_1 = __importDefault(require("../routes/localidad.routes"));
const reserva_routes_1 = __importDefault(require("../routes/reserva.routes"));
const modelo_routes_1 = __importDefault(require("../routes/modelo.routes"));
const marca_routes_1 = __importDefault(require("../routes/marca.routes"));
const parada_routes_1 = __importDefault(require("../routes/parada.routes"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
const empresa_routes_1 = __importDefault(require("../routes/empresa.routes"));
const connection_1 = __importDefault(require("../db/connection"));
const cors_1 = __importDefault(require("cors"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3000';
        this.middlewares();
        this.routes();
        this.conectarDB();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Aplicación corriendo por el puerto ', this.port);
        });
    }
    middlewares() {
        //Parseo del body
        this.app.use(express_1.default.json());
        //CORS
        this.app.use((0, cors_1.default)());
    }
    routes() {
        this.app.use('/api/charters', charter_routes_1.default);
        this.app.use('/api/viajes', viaje_routes_1.default);
        this.app.use('/api/provincias', provincia_routes_1.default);
        this.app.use('/api/localidades', localidad_routes_1.default);
        this.app.use('/api/reservas', reserva_routes_1.default);
        this.app.use('/api/modelos', modelo_routes_1.default);
        this.app.use('/api/marcas', marca_routes_1.default);
        this.app.use('/api/paradas', parada_routes_1.default);
        this.app.use('/api/usuarios', user_routes_1.default);
        this.app.use('/api/empresas', empresa_routes_1.default);
    }
    conectarDB() {
        //Conexión a la base de datos
        connection_1.default.connect((err) => {
            if (err) {
                throw err;
            }
            else {
                console.log('Base de datos conectada');
            }
            ;
        });
    }
}
exports.default = Server;
