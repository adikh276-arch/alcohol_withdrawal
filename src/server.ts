import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pool from './lib/db';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;
const APP_SUBPATH = '/alcohol_withdrawal';

// Standardize subpath
const cleanSubpath = APP_SUBPATH.startsWith('/') ? APP_SUBPATH : `/${APP_SUBPATH}`;
const normalizedSubpath = cleanSubpath.endsWith('/') ? cleanSubpath.slice(0, -1) : cleanSubpath;

app.use(cors());
app.use(bodyParser.json());

// Diagnostics
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} (Host: ${req.headers.host})`);
  next();
});

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', version: '2.0', subpath: normalizedSubpath }));
app.get(`${normalizedSubpath}/health`, (req, res) => res.json({ status: 'ok', version: '2.0', subpath: normalizedSubpath }));
app.get('/ping', (req, res) => res.send('pong'));

// Initialize schema
const __app_root = '/app';
const initDb = async () => {
  try {
    const schemaPath = path.resolve(__app_root, 'database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schema);
      console.log('Database schema initialized.');
    }
  } catch (err) {
    console.error('Schema initialization failed:', err);
  }
};
initDb();

// ── API Router ──────────────────────────────────────────────────────────────
const apiRouter = express.Router();

apiRouter.get('/ping', (req, res) => res.send('pong'));

apiRouter.post('/user/init', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).send('User ID required.');
  try {
    await pool.query('INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING', [id]);
    res.sendStatus(201);
  } catch (err) {
    console.error('User initialization error:', err);
    res.status(500).send(err);
  }
});

apiRouter.get('/withdrawal', async (req, res) => {
  const user_id = req.headers['x-user-id'] as string;
  if (!user_id) return res.status(401).send('Unauthorized');
  try {
    const result = await pool.query('SELECT * FROM withdrawal_logs WHERE user_id = $1 ORDER BY timestamp DESC', [user_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

apiRouter.post('/withdrawal', async (req, res) => {
  const user_id = req.headers['x-user-id'] as string;
  const { id, severity, symptoms, notes, vitalSigns, timestamp } = req.body;
  if (!user_id) return res.status(401).send('Unauthorized');
  try {
    await pool.query(
      'INSERT INTO withdrawal_logs (id, user_id, severity, symptoms, notes, heart_rate, blood_pressure, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, user_id, severity, symptoms, notes, vitalSigns?.heartRate, vitalSigns?.bloodPressure, timestamp]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
});

apiRouter.delete('/withdrawal/:id', async (req, res) => {
  const user_id = req.headers['x-user-id'] as string;
  const { id } = req.params;
  if (!user_id) return res.status(401).send('Unauthorized');
  try {
    await pool.query('DELETE FROM withdrawal_logs WHERE id = $1 AND user_id = $2', [id, user_id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Mount API at BOTH /api and /alcohol_withdrawal/api
app.use('/api', apiRouter);
app.use(`${normalizedSubpath}/api`, apiRouter);

// ── Static Files ─────────────────────────────────────────────────────────────
const distPath = '/app/dist';
if (fs.existsSync(distPath)) {
  console.log('--- DIRECTORY HIERARCHY ---');
  const walk = (dir: string) => {
    fs.readdirSync(dir).forEach(f => {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) walk(p);
      else console.log(`[FILE] ${p}`);
    });
  };
  walk(distPath);
}

app.use(express.static(distPath));
app.use(normalizedSubpath, express.static(distPath));

// ── SPA Catch-all ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  if (req.path.includes('/api/')) {
    return res.status(404).send('API endpoint not found');
  }
  
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log(`[SPA Fallback] Serving index.html for: ${req.url}`);
    res.sendFile(indexPath);
  } else {
    console.error(`[ERROR] index.html not found at ${indexPath}`);
    res.status(404).send('Application not ready (index.html missing)');
  }
});

app.listen(port, () => {
  console.log(`Server v2.0 running on port ${port}`);
  console.log(`API mounted at /api and ${normalizedSubpath}/api`);
  console.log(`Static files at / and ${APP_SUBPATH}`);
});
