// abgeschottet-ki/aki-backend/src/routes/pdf/read.ts
import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';

const createRouter = Router();

// GET route
createRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    ...header,
    severity: 'success',
    title: 'Lst of pdfs in the pdf table',
  });
});

export default createRouter;
