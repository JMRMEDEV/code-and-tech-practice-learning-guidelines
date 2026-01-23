import { http } from './http'

export const loginRequest = (email: string, password: string) =>
  http('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  export const registerRequest = (
    email: string,
    password: string
  ) =>
    http('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })