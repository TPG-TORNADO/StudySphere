import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import AlertMessage from '../components/AlertMessage.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-panel glass text-center"
      >
        <div className="mb-4 d-inline-flex bg-primary rounded-4 p-3 shadow-primary">
          <LayoutDashboard size={32} className="text-white" />
        </div>
        <h1 className="h3 mb-1">Welcome Back</h1>
        <p className="text-secondary small mb-4">Log in to continue your learning journey.</p>
        
        {error && <AlertMessage variant="danger">{error}</AlertMessage>}

        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-3">
            <label className="form-label small fw-bold text-uppercase text-muted">Email Address</label>
            <div className="position-relative">
              <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                <Mail size={18} />
              </span>
              <input
                className="form-control ps-5"
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={updateField}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold text-uppercase text-muted">Password</label>
            <div className="position-relative">
              <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                <Lock size={18} />
              </span>
              <input
                className="form-control ps-5"
                id="password"
                name="password"
                type="password"
                placeholder="Your secure password"
                value={form.password}
                onChange={updateField}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={loading}>
            {loading ? <div className="spinner-border spinner-border-sm"></div> : <><LogIn size={18} /> Log In</>}
          </button>
        </form>

        <p className="mt-4 mb-0 small text-secondary">
          Don't have an account? <Link to="/register" className="link-primary fw-bold text-decoration-none">Create one</Link>
        </p>
      </motion.div>
    </div>
  )
}

