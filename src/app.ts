import express, { Request, Response, NextFunction } from 'express';
import { buildSchema } from './database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(async (req, res, next) => {
  try {
    await buildSchema();
    next();
  } catch (err: any) {
    console.error('Error initializing database schema:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use(express.json());

// In-memory "database"
const data: Record<string, any>[] = [];

// Helper function to find an item by id
function findItemById(collection: string, id: string): Record<string, any> | undefined {
  return data.find((item) => item.id === id && item.collection === collection);
}

// API endpoints
// POST /:collection
app.post('/:collection', (req, res) => {
  const collection = req.params.collection;
  const newItem = { ...req.body, collection, id: Math.random().toString(36).substr(2, 9) };
  data.push(newItem);
  res.json(newItem);
});

// GET /:collection/:id
app.get('/:collection/:id', (req, res) => {
  const collection = req.params.collection;
  const id = req.params.id;
  const item = findItemById(collection, id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// POST /:collection/:id
app.post('/:collection/:id', (req, res) => {
  const collection = req.params.collection;
  const id = req.params.id;
  const item = findItemById(collection, id);
  if (item) {
    Object.assign(item, req.body);
    res.json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// DELETE /:collection/:id
app.delete('/:collection/:id', (req, res) => {
  const collection = req.params.collection;
  const id = req.params.id;
  const index = data.findIndex((item) => item.id === id && item.collection === collection);
  if (index !== -1) {
    data.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
