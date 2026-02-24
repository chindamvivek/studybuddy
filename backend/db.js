import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const DB_PATH = process.env.DB_PATH || 'studybuddy.db';
const DB_VERBOSE = process.env.DB_VERBOSE_SQL === 'true';

const db = new Database(DB_PATH, DB_VERBOSE ? { verbose: console.log } : {});

// Create or update schema
db.pragma('foreign_keys = ON');

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

const createCoursesTable = `
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );
`;

const createNotesTable = `
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
  );
`;

const initDb = () => {
    try {
        db.exec(createUsersTable);
        db.exec(createCoursesTable);
        db.exec(createNotesTable);
        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

export { db, initDb };
