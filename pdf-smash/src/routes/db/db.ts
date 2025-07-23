// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/routes/db/db.ts
import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import structureRouter from './structure';
import { endpoints } from '../../lib';

const router = Router();

// GET /db
router.get('/', (req: Request, res: Response) => {
  res.json({
    ...header,
    ...endpoints['db']
  });
});

// Mount structure routes at /db/structure
router.use('/structure', structureRouter);

export default router;
