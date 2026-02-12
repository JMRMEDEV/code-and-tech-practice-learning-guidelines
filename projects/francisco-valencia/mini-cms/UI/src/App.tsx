import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import AppRouter from './routes/AppRouter'
import AppLayout from './components/layout/AppLayout'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  )
}
