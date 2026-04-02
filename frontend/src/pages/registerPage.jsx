import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import authService from '../services/authService'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    setError('')
    try {
      const data = await authService.register(form)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Create account</h1>
          <p style={{ color: 'var(--text2)', marginTop: '.4rem' }}>Join CyQuiz and start competing</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => set('username', e.target.value)}
                placeholder="e.g. panha123"
                required
              />
            </div>
            <div className="form-group">
              <label className="label">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Min 6 characters"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-gold btn-full"
              disabled={loading}
              style={{ marginTop: '.5rem' }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.9rem', color: 'var(--text2)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
