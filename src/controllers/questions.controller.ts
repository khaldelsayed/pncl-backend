import { ControllerRoute } from './controller-route.interface';
import { Request, Response, Router } from 'express';
import { QuestionsService } from '../services/questions.service';

export class QuestionsController implements ControllerRoute {
  public path: string = '/questions';
  public router: Router = Router();
  private questionsService: QuestionsService;

  constructor() {
    this.questionsService = new QuestionsService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${ this.path }/load`, this.loadQuestions);
    this.router.get(`${ this.path }/search`, this.searchQuestions);
  }

  private loadQuestions = async (req: Request, res: Response) => {
    try {
      await this.questionsService.loadQuestionsFromCSV();
      res.status(200).json({ message: 'Questions are loaded from CSV!' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to load questions from CSV!' });
    }
  };

  private searchQuestions = async (req: Request, res: Response) => {
    try {
      if (!req.query.q) {
        return res.status(400).json({ message: 'Please provide q parameter with topic name' });
      }
      const topicName = (req.query.q as string).trim().toLowerCase();
      const questions = await this.questionsService.searchQuestions(topicName);
      res.status(200).json({ questions });
    } catch (err) {
      res.status(500).json({ message: 'Failed to get questions from server' });
    }
  };
}
