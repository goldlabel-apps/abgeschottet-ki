// abgeschottet-ki/pdf-smash/src/routes/test/test.ts

import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';

const router = Router();

// Example: GET /test
router.get('/', (req: Request, res: Response) => {
  res.json({
    ...header,
    message: 'TEST route root',
  });
});

// Example: GET /test/info
router.get('/info', (req: Request, res: Response) => {
  res.json({
    ...header,
    db: 'Your test info here',
  });
});

// You can add more routes like POST /test/add, etc.

export default router;
