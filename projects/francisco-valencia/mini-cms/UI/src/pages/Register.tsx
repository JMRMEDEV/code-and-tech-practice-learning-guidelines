import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerRequest } from '../api/auth.api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await registerRequest(email, password)
      setLoading(false)
      navigate('/login')
    } catch {
      setError('Error al registrar usuario')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[400px]"
      >
        <h2 className="text-xl font-semibold mb-4">Register</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <Input
          className="mb-[10px]"
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <Input
          className="mb-[10px]"
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <Button type="submit" className="mb-[10px]" disabled={loading || !email || !password}>
         {loading ? 'Creating account...' : 'Create account'}
        </Button>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
