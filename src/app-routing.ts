import { QuestionsController } from './controllers/questions.controller';
import { TopicsController } from './controllers/topics.controller';
import { ControllerRoute } from './controllers/controller-route.interface';

export class AppRouting {
  getControllersRoutes(): ControllerRoute[] {
    return [
      new QuestionsController(),
      new TopicsController()
    ];
  }
}
