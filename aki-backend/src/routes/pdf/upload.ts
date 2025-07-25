// /Users/goldlabel/GitHub/abgeschottet-ki/aki-backend/src/routes/pdf/upload.ts

import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';

const createRouter = Router();

createRouter.post('/', (req: Request, res: Response) => {
  try {
    console.log("Uploading...")
    res.json({
      ...header,
      severity: "success",
      title: "Uploaded OK"
    });
  } catch (err: any) {
    console.error('Error in /db/create:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  }
});

export default createRouter;

