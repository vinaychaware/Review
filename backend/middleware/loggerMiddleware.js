export const requestLogger = (req, res, next) => {
  const start = Date.now()
  
  // Log request
  console.log(`📥 ${req.method} ${req.originalUrl} - ${req.ip}`)
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start
    const statusColor = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢'
    console.log(`📤 ${statusColor} ${res.statusCode} ${req.method} ${req.originalUrl} - ${duration}ms`)
  })
  
  next()
}