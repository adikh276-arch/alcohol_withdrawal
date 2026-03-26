import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pool from './lib/db';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// Initialize schema
const initDb = async () => {
  try {
    const fs = await import('fs');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
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

// User Initialization
app.post('/api/user/init', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).send('User ID required.');

  try {
    await pool.query(
      'INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING',
      [id]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error('User initialization error:', err);
    res.status(500).send(err);
  }
});

// Logs - Fetch for user
app.get('/api/withdrawal', async (req, res) => {
  const user_id = req.headers['x-user-id'] as string;
  if (!user_id) return res.status(401).send('Unauthorized');

  try {
    const result = await pool.query(
      'SELECT * FROM withdrawal_logs WHERE user_id = $1 ORDER BY timestamp DESC',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Logs - Add
app.post('/api/withdrawal', async (req, res) => {
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

// Logs - Remove
app.delete('/api/withdrawal/:id', async (req, res) => {
  const user_id = req.headers['x-user-id'] as string;
  const { id } = req.params;
  if (!user_id) return res.status(401).send('Unauthorized');

  try {
    await pool.query(
      'DELETE FROM withdrawal_logs WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Health check
app.get('/api/ping', (req, res) => res.send('pong'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  
  // Serve static files from subpath
  app.use('/alcohol_withdrawal', express.static(distPath));

  // Root redirect and SPA fallback
  app.get('*', (req, res) => {
    if (req.path === '/' || req.path === '/alcohol_withdrawal') {
      return res.redirect('/alcohol_withdrawal/');
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
