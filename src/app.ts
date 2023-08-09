import express, { Request, Response, NextFunction } from 'express';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_FILE = 'database.db'; 

// In-memory "database"
let data: Record<string, any>[] = [];

// Helper function to find an item by id
function findItemById(collection: string, id: string): Record<string, any> | undefined {
  return data.find((item) => item.id === id && item.collection === collection);
}

// Function to initialize the database schema
async function buildSchema() {
  const db: Database = await open({
    filename: DATABASE_FILE,
    driver: sqlite3.Database,
  });

  // Implement the logic to read JSON schema files and create tables/add columns here
  // For this example, we will create a simple "items" table.
  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      collection TEXT,
      data JSON
    )
  `);

  console.log('Database schema initialized.');
}

// Middleware to initialize the database schema
app.use(async (req, res, next) => {
  try {
    await buildSchema(); // Initialize the database schema based on JSON schema files
    next();
  } catch (err: any) { // Use the "any" type for "err"
    console.error('Error initializing database schema:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use(express.json());

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

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export const app = express();
