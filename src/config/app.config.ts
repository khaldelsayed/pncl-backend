import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { LoggerProvider } from '../providers/logger.provider';
import bunyan from 'bunyan';
import { ControllerRoute } from '../controllers/controller-route.interface';
import { AppRouting } from '../app-routing';

export class AppConfig {
  private app: express.Application;
  private logger: bunyan;

  constructor() {
    this.app = express();
    this.logger = new LoggerProvider().getLogger();

    this.connectToDatabase();
    this.configureMiddlewares();
    this.initializeControllers((new AppRouting()).getControllersRoutes());
  }

  public listen() {
    this.app.listen(process.env.PORT);
  }

  private configureMiddlewares() {
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded());
  }

  private connectToDatabase() {
    mongoose.connect(process.env.MONGO_ATLAS_URL)
      .then(() => this.logger.info('Connected to database!'))
      .catch(err => this.logger.info(err, 'Connection to database failed!'));
  }

  private initializeControllers(controllers: ControllerRoute[]) {
    controllers.forEach((controller) => {
      this.app.use('/api', controller.router);
    });
  }
}
