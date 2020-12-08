import { ControllerRoute } from './controller-route.interface';
import { Request, Response, Router } from 'express';
import { TopicsService } from '../services/topics.service';

export class TopicsController implements ControllerRoute {
  public path: string = '/topics';
  public router: Router = Router();
  private topicsService: TopicsService;

  constructor() {
    this.topicsService = new TopicsService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${ this.path }/load`, this.loadTopics);
  }

  private loadTopics = async (req: Request, res: Response) => {
    try {
      await this.topicsService.loadTopicsFromCSV();
      res.status(200).json({ message: 'Topics are loaded from CSV!' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to load topics from CSV!' });
    }
  };
}
