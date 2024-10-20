import express from 'express';
import routesCharters from '../routes/charter.routes';
import routesViajes from '../routes/viaje.routes';
import routesProvincias from '../routes/provincia.routes';
import routesLocalidades from '../routes/localidad.routes';
import routesReservas from '../routes/reserva.routes';
import routesModelos from '../routes/modelo.routes';
import routesMarcas from '../routes/marca.routes';
import routesParadas from '../routes/parada.routes';
import routesUsuarios from '../routes/user.routes';
import routesEmpresas from '../routes/empresa.routes';
import routesNotificaciones from '../routes/notificacion.routes';
import connection from '../db/connection';
import cors from 'cors';

class Server {

    private app: express.Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3000';
        this.middlewares();
        this.routes();
        this.conectarDB();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Aplicación corriendo por el puerto ', this.port);
        })
    }

    middlewares() {

        //Parseo del body
        this.app.use(express.json());

        //CORS
        this.app.use(cors());
    }

    routes() {
        this.app.use('/api/charters', routesCharters);
        this.app.use('/api/viajes', routesViajes);
        this.app.use('/api/provincias', routesProvincias);
        this.app.use('/api/localidades', routesLocalidades);
        this.app.use('/api/reservas', routesReservas);
        this.app.use('/api/modelos', routesModelos);
        this.app.use('/api/marcas', routesMarcas);
        this.app.use('/api/paradas', routesParadas);
        this.app.use('/api/usuarios', routesUsuarios);
        this.app.use('/api/empresas', routesEmpresas);
        this.app.use('/api/notificaciones', routesNotificaciones);
    }

    conectarDB() {
        //Conexión a la base de datos
        connection.connect((err) => {
            if(err) {
                throw err;
            } else {
                console.log('Base de datos conectada');
            };
        });
    }
    
}

export default Server;