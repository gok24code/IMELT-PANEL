import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql, { Pool } from 'mysql2/promise'; // Use the promise-based version

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let pool: Pool;

async function connectToDatabase() {
  try {
    pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('Connected to MySQL database!');
  } catch (error: unknown) { // Explicitly type error as unknown
    console.error('Failed to connect to MySQL database:', error);
    process.exit(1); // Exit if database connection fails
  }
}

// Test endpoint to fetch data from the database
app.get('/api/test', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ message: 'Database pool not initialized.' });
    }
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Database connection successful!', data: rows });
  } catch (error: unknown) { // Explicitly type error as unknown
    console.error('Error fetching data from database:', error);
    // Add type guard for error
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error fetching data', error: error.message });
    } else {
      res.status(500).json({ message: 'Error fetching data', error: 'An unknown error occurred.' });
    }
  }
});

// GET /api/students endpoint to fetch all students
app.get('/api/students', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ message: 'Database pool not initialized.' });
    }
    const [rows] = await pool.query('SELECT id, name, lat, lng FROM students');
    res.json(rows); // Return the students data
  } catch (error: unknown) {
    console.error('Error fetching students from database:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error fetching students', error: error.message });
    } else {
      res.status(500).json({ message: 'Error fetching students', error: 'An unknown error occurred.' });
    }
  }
});

// POST /api/students endpoint to add a new student
app.post('/api/students', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ message: 'Database pool not initialized.' });
    }
    const { name, lat, lng } = req.body;

    if (!name || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'Missing required fields: name, lat, or lng' });
    }

    const [result] = await pool.execute(
      'INSERT INTO students (name, lat, lng) VALUES (?, ?, ?)',
      [name, lat, lng]
    );

    // Assert that result is an OkPacket
    const okPacket = result as mysql.OkPacket;
    res.status(201).json({ message: 'Student added successfully', studentId: okPacket.insertId });
  } catch (error: unknown) {
    console.error('Error adding student to database:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error adding student', error: error.message });
    } else {
      res.status(500).json({ message: 'Error adding student', error: 'An unknown error occurred.' });
    }
  }
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Connect to database before starting the server
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});