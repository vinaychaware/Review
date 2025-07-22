import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ error: "GET method not allowed. Use POST to submit data." }, { status: 405 })
}

export async function POST(request) {
  try {
    const formData = await request.formData()

    const name = formData.get('name')
    const email = formData.get('email')
    const phone = formData.get('phone')
    const rating = parseFloat(formData.get('rating'))
    const description = formData.get('description') || ''
    const reason_ids = JSON.parse(formData.get('reason_ids') || '[]')
    const latitude = parseFloat(formData.get('latitude'))
    const longitude = parseFloat(formData.get('longitude'))
    const address = formData.get('address') || ''
    const imageCount = parseInt(formData.get('imageCount') || '0')

    if (!name || !email || !phone || isNaN(rating) || isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const images = []
    for (let i = 0; i < imageCount; i++) {
      const imageFile = formData.get(`image_${i}`)
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const mimeType = imageFile.type
        const base64String = `data:${mimeType};base64,${base64}`
        images.push(base64String)
      }
    }

    const client = await pool.connect()

    const insertQuery = `
      INSERT INTO scanned_feedback (
        toilet_id, name, email, phone, rating, description, reason_ids, images, latitude, longitude, address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `

    const result = await client.query(insertQuery, [
      1,
      name,
      email,
      phone,
      rating,
      description,
      reason_ids,
      images,
      latitude,
      longitude,
      address
    ])

    client.release()

    return NextResponse.json({
      message: 'Review submitted successfully',
      data: result.rows[0]
    }, { status: 200 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
