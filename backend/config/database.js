import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

class PostgreSQLDatabase {
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required')
    }

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
      } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    this.testConnection()
  }

  async testConnection() {
    try {
      const client = await this.pool.connect()
      const result = await client.query('SELECT version()')
      console.log('✅ PostgreSQL connected successfully')
      console.log(`📊 Database version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`)
      client.release()
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error.message)
      console.log('Please check your PostgreSQL DATABASE_URL in .env file')
      throw error
    }
  }

  async query(text, params) {
    const start = Date.now()
    try {
      const result = await this.pool.query(text, params)
      const duration = Date.now() - start
      if (process.env.NODE_ENV === 'development') {
        console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rowCount })
      }
      return result
    } catch (error) {
      console.error('PostgreSQL query error:', error)
      throw error
    }
  }

  async getClient() {
    return await this.pool.connect()
  }

  async close() {
    await this.pool.end()
    console.log('PostgreSQL connection pool closed')
  }
}

export default new PostgreSQLDatabase()