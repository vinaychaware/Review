// const express = require('express')
import express from 'express';

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'User route working' })
})

export default router;