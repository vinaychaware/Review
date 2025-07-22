import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

class Database {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
      } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    })

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    // Test connection on startup
    this.testConnection()
  }

  async testConnection() {
    try {
      const client = await this.pool.connect()
      console.log('✅ Database connected successfully')
      client.release()
    } catch (error) {
      console.error('❌ Database connection failed:', error.message)
      process.exit(1)
    }
  }

  async query(text, params) {
    const start = Date.now()
    try {
      const result = await this.pool.query(text, params)
      const duration = Date.now() - start
      console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rowCount })
      return result
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  }

  async getClient() {
    return await this.pool.connect()
  }

  async close() {
    await this.pool.end()
    console.log('Database connection pool closed')
  }
}

export default new Database()