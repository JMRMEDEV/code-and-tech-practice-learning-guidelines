import { getToken } from '../utils/storage'

export const API_URL = 'https://cms-api-1-41ne.onrender.com'

export const http = async (url: string, options: RequestInit = {}) => {
  const token = getToken()

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!res.ok) throw new Error('API error')
  return res.json()
}
