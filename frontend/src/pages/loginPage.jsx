import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import authService from '../services/authService'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await authService.login(form)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-left-brand">Cy<span>Quiz</span></div>
        <div className="auth-tagline">Learn. Test.<br /><em>Achieve.</em></div>
        <div className="auth-desc">
          Challenge yourself with expertly crafted quizzes. Score well, get explanations, and study the topics you missed.
        </div>
        <div className="auth-features">
          <div className="auth-feat"><div className="auth-feat-dot" />Timed quizzes with real-time countdown</div>
          <div className="auth-feat"><div className="auth-feat-dot" />Instant score calculation and feedback</div>
          <div className="auth-feat"><div className="auth-feat-dot" />Study explanations for wrong answers</div>
          <div className="auth-feat"><div className="auth-feat-dot" />Admin panel to create and manage quizzes</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-form-title">Welcome back</h1>
          <p className="auth-form-sub">Sign in to your account to continue.</p>

          {error && <div className="alert alert-err">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-gold btn-full"
              disabled={loading}
              style={{ marginTop: '.5rem' }}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.85rem', color: 'var(--ink3)' }}>
            Don't have an account?{' '}
            <a href="/register" style={{ color: 'var(--gold)', fontWeight: 700 }}>Create one</a>
          </p>
        </div>
      </div>
    </div>
  )
}
