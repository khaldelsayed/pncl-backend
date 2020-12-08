import bunyan from 'bunyan';

export class LoggerProvider {
  private readonly logger: bunyan;

  constructor() {
    this.logger = bunyan.createLogger({ name: 'pencil-backend' });
  }

  public getLogger() {
    return this.logger;
  }
}
