// /Users/goldlabel/GitHub/abgeschottet-ki/aki-backend/src/routes/pdf/index.ts
import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import uploadRouter from './upload';
import { endpoints } from '../../lib';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    ...header,
    ...endpoints['pdf']
  });
});

router.use('/upload', uploadRouter);

export default router;
