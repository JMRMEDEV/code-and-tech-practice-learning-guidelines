import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginRequest } from '../api/auth.api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { access_token } = await loginRequest(email, password)
      login(access_token)
      navigate('/dashboard')
    } catch {
      setError('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-[400px]"
      >
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <Input
          type="email"
          name='email'
          label="Email"
          className="mb-[10px]"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          name='password'
          label="Password"
          className="mb-[10px]"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <Button type="submit" className="mb-[10px]" disabled={loading || !email || !password}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>

        <p className="text-sm text-center mt-4">
          No account?{' '}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
