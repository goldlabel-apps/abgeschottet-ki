// aki/pdf-smash/src/routes/ki/index.ts

import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import summariseRouter from './summarise';

const router = Router();

// Example: GET /ki
router.get('/', (req: Request, res: Response) => {
  res.json({
    ...header,
    message: 'KI route root',
  });
});

router.use('/summarise', summariseRouter);

export default router;
