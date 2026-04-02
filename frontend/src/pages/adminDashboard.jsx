import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import quizService from '../services/quizService'
import attemptService from '../services/attemptService'
import AdminSidebar from '../components/adminSidebar'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([quizService.getAll(), attemptService.getAllAttempts()])
      .then(([q, a]) => { setQuizzes(q); setAttempts(a) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this quiz and all its questions?')) return
    await quizService.delete(id)
    setQuizzes(qs => qs.filter(q => q.id !== id))
  }

  const published  = quizzes.filter(q => q.is_published).length
  const passCount  = attempts.filter(a => a.total_questions > 0 && Math.round(a.correct_answers / a.total_questions * 100) >= 70).length
  const avgScore   = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : 0
  const totalUsers = [...new Set(attempts.map(a => a.user_id))].length

  if (loading) return <div className="spinner" />

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="page-body fade-in">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--ink1)' }}>Admin Dashboard</h2>
            <p style={{ color: 'var(--ink3)', marginTop: '.25rem' }}>Manage quizzes, questions, and view platform activity.</p>
          </div>

          {/* STATS */}
          <div className="stat-row">
            <div className="stat-card">
              <div className="stat-num" style={{ color: 'var(--gold)' }}>{quizzes.length}</div>
              <div className="stat-lbl">Total Quizzes</div>
              <span className="stat-badge" style={{ background: 'var(--gold-light)', color: 'var(--gold-dark)' }}>{published} published</span>
            </div>
            <div className="stat-card">
              <div className="stat-num">{attempts.length}</div>
              <div className="stat-lbl">Total Attempts</div>
              <span className="stat-badge" style={{ background: 'var(--cream)', color: 'var(--ink3)' }}>all users</span>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{ color: 'var(--teal)' }}>{totalUsers}</div>
              <div className="stat-lbl">Active Users</div>
              <span className="stat-badge" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>with attempts</span>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{ color: avgScore >= 70 ? 'var(--teal)' : avgScore > 0 ? '#e67e22' : 'var(--ink3)' }}>
                {avgScore || '—'}
              </div>
              <div className="stat-lbl">Avg Score</div>
              <span className="stat-badge" style={{ background: 'var(--cream)', color: 'var(--ink3)' }}>platform-wide</span>
            </div>
          </div>

          {/* QUIZ LIST */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--ink1)' }}>All Quizzes</div>
                <div style={{ fontSize: '.83rem', color: 'var(--ink3)', marginTop: '.2rem' }}>Manage quizzes on the platform</div>
              </div>
              <Link to="/admin/quiz/new" className="btn btn-gold btn-sm">+ Create Quiz</Link>
            </div>

            {quizzes.length === 0 ? (
              <div className="empty" style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <p>No quizzes yet.</p>
                <Link to="/admin/quiz/new" className="btn btn-gold btn-sm" style={{ marginTop: '.75rem' }}>Create one</Link>
              </div>
            ) : (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr><th>Title</th><th>Questions</th><th>Time</th><th>Status</th><th>Attempts</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {quizzes.map(q => {
                      const qAttempts = attempts.filter(a => a.quiz_id === q.id).length
                      return (
                        <tr key={q.id}>
                          <td style={{ fontWeight: 600 }}>{q.title}</td>
                          <td>{q.question_count || 0}</td>
                          <td>{q.time_limit}s</td>
                          <td>
                            <span className={`pill ${q.is_published ? 'pill-pass' : 'pill-fail'}`}>
                              {q.is_published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td>{qAttempts}</td>
                          <td style={{ display: 'flex', gap: '.5rem' }}>
                            <Link to={`/admin/quiz/${q.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                            <button className="btn btn-red btn-sm" onClick={() => handleDelete(q.id)}>Delete</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* RECENT ATTEMPTS */}
          {attempts.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--ink1)' }}>Recent Attempts</div>
                <Link to="/admin/scores" style={{ fontSize: '.85rem', color: 'var(--gold-dark)', fontWeight: 600 }}>View all →</Link>
              </div>
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr><th>User</th><th>Quiz</th><th>Score</th><th>Correct</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {attempts.slice(0, 8).map(a => (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 600 }}>{a.username}</td>
                        <td style={{ color: 'var(--ink2)' }}>{a.quiz_title}</td>
                        <td><span className="pill pill-gold">{a.score} pts</span></td>
                        <td style={{ color: 'var(--ink2)' }}>{a.correct_answers}/{a.total_questions}</td>
                        <td style={{ color: 'var(--ink3)', fontSize: '.83rem' }}>
                          {new Date(a.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
