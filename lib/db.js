// lib/db.js
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:12345d@localhost:5432/user_response',
  ssl: {
    rejectUnauthorized: false, 
  },
})

export default pool
