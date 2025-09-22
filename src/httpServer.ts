import Express, { Application, Router } from 'express';
import compression from 'compression';
import cors from 'cors';
import { BaseController } from './controllers/baseController';

export class HttpServer {
    private readonly app: Application;

    constructor(controllers: BaseController[], onTerminate: () => void) {
        this.app = Express();
        this.app.use(Express.json());
        this.app.use(Express.urlencoded({ extended: true }));
        this.app.use(compression());
        // this.app.use(cors({ origin: 'http://abc.com' }));
        this.app.use(cors());

        const router = Router();

        controllers.forEach((controller) => controller.init(router));

        this.app.use('/api', router);

        const server = this.app.listen(3000, () => {
            console.log('HTTP server started.');
        });

        process.on('SIGTERM', async () => {
            console.log('SIGTERM signal received: closing HTTP server');

            onTerminate();

            server.close(() => {
                console.log('HTTP server closed');
            });
        });
    }
}
