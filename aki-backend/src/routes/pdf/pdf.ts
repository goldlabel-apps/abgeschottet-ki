// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/routes/pdf/pdf.ts
import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import { endpoints } from '../../lib';

const router = Router();

// GET /pdf
router.get('/', (req: Request, res: Response) => {
  res.json({
    ...header,
    ...endpoints['pdf']
  });
});

// Mount structure routes at /db/structure
// router.use('/structure', structureRouter);

export default router;
