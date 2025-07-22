import express from 'express'
import db from '../config/database.js'
import { asyncHandler } from '../middleware/errorMiddleware.js'

const router = express.Router()

// GET /api/health - Basic health check
router.get('/', asyncHandler(async (req, res) => {
  let postgresStatus = 'disconnected'
  let dbLatency = null
  
  try {
    const start = Date.now()
    const result = await db.query('SELECT version()')
    dbLatency = Date.now() - start
    postgresStatus = 'connected'
  } catch (error) {
    console.error('PostgreSQL health check failed:', error)
  }

  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    postgresql: {
      status: postgresStatus,
      latency: dbLatency ? `${dbLatency}ms` : null
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    }
  }

  const statusCode = postgresStatus === 'connected' ? 200 : 503

  res.status(statusCode).json({
    success: postgresStatus === 'connected',
    data: healthData,
    message: postgresStatus === 'connected' ? 'PostgreSQL service is healthy' : 'PostgreSQL service is unhealthy'
  })
}))

// GET /api/health/detailed - Detailed health check
router.get('/detailed', asyncHandler(async (req, res) => {
  const checks = []

  // PostgreSQL check
  try {
    const start = Date.now()
    const result = await db.query('SELECT COUNT(*) FROM scanned_feedback')
    const latency = Date.now() - start
    
    checks.push({
      name: 'postgresql',
      status: 'pass',
      latency: `${latency}ms`,
      details: `${result.rows[0].count} reviews in PostgreSQL database`
    })
  } catch (error) {
    checks.push({
      name: 'postgresql',
      status: 'fail',
      error: error.message
    })
  }

  // Memory check
  const memUsage = process.memoryUsage()
  const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100
  
  checks.push({
    name: 'memory',
    status: memoryUsagePercent < 90 ? 'pass' : 'warn',
    usage: `${Math.round(memoryUsagePercent)}%`,
    details: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB / ${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
  })

  const overallStatus = checks.every(check => check.status === 'pass') ? 'pass' : 
                       checks.some(check => check.status === 'fail') ? 'fail' : 'warn'

  res.json({
    success: overallStatus !== 'fail',
    data: {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks
    },
    message: `Health check ${overallStatus}`
  })
}))

export default router