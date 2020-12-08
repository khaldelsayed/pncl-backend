import { Router } from 'express';

export interface ControllerRoute {
  path: string;
  router: Router;
}
