import { Pool } from 'pg'

class DatabaseConnection {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:12345d@localhost:5432/user_response',
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
  }

  async query(text, params) {
    const client = await this.pool.connect()
    try {
      const result = await client.query(text, params)
      return result
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    } finally {
      client.release()
    }
  }

  async getClient() {
    return await this.pool.connect()
  }

  async close() {
    await this.pool.end()
  }
}

export default new DatabaseConnection()