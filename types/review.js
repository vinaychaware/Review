// Review type definitions for JSX
export const ReviewSchema = {
  id: 'string',
  toilet_id: 'number',
  name: 'string',
  email: 'string',
  phone: 'string',
  rating: 'number',
  description: 'string',
  reason_ids: 'array',
  images: 'array',
  created_at: 'string',
  updated_at: 'string'
}

export const LocationSchema = {
  latitude: 'number',
  longitude: 'number',
  address: 'string'
}