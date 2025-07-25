// abgeschottet-ki/pdf-smash/src/routes/ki/ki.ts

import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';

const router = Router();

// Example: GET /ki
router.get('/', (req: Request, res: Response) => {
  res.json({
    ...header,
    message: 'KI route root',
  });
});

// Example: GET /ki/info
router.get('/info', (req: Request, res: Response) => {
  res.json({
    ...header,
    db: 'KI test info here',
  });
});

export default router;

