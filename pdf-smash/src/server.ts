  // /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/server.ts
import express from 'express';
import cors from 'cors';
import {header} from './lib/header'

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// API Home
app.get('/', (req, res) => {
  try {
    res.json({ 
      ...header,
    });
  } catch (err: any) {
    console.error('Error in /:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`pdf-smash service running on http://localhost:${PORT}`);
});
