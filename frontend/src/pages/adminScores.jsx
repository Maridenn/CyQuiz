import { useState, useEffect } from 'react'
import attemptService from '../services/attemptService'
import AdminSidebar from '../components/adminSidebar'

export default function AdminScores() {
  const [attempts, setAttempts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    attemptService.getAllAttempts()
      .then(data => { setAttempts(data); setFiltered(data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = [...attempts]
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(a => a.username?.toLowerCase().includes(s) || a.quiz_title?.toLowerCase().includes(s))
    }
    if (sortBy === 'score') result.sort((a, b) => b.score - a.score)
    else if (sortBy === 'name') result.sort((a, b) => (a.username || '').localeCompare(b.username || ''))
    else result.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
    setFiltered(result)
  }, [search, sortBy, attempts])

  const totalAttempts = attempts.length
  const passCount  = attempts.filter(a => a.total_questions > 0 && Math.round(a.correct_answers / a.total_questions * 100) >= 70).length
  const failCount  = totalAttempts - passCount
  const avgScore   = totalAttempts ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / totalAttempts) : 0

  if (loading) return <div className="spinner" />

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="page-body fade-in">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--ink1)' }}>All Scores</h2>
            <p style={{ color: 'var(--ink3)', marginTop: '.25rem' }}>Every quiz attempt across all users.</p>
          </div>

          <div className="stat-row">
            <div className="stat-card">
              <div className="stat-num">{totalAttempts}</div>
              <div className="stat-lbl">Total Attempts</div>
              <span className="stat-badge" style={{ background: 'var(--cream)', color: 'var(--ink3)' }}>all time</span>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{ color: 'var(--teal)' }}>{passCount}</div>
              <div className="stat-lbl">Passed</div>
              <span className="stat-badge" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>≥ 70%</span>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{ color: 'var(--red)' }}>{failCount}</div>
              <div className="stat-lbl">Failed</div>
              <span className="stat-badge" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>below 70%</span>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{ color: avgScore >= 70 ? 'var(--teal)' : avgScore > 0 ? '#e67e22' : 'var(--ink3)' }}>
                {avgScore || '—'}
              </div>
              <div className="stat-lbl">Avg Score</div>
              <span className="stat-badge" style={{ background: 'var(--cream)', color: 'var(--ink3)' }}>platform-wide</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user or quiz title…" />
            </div>
            <div className="field" style={{ marginBottom: 0, minWidth: '180px' }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="date">Sort: Latest First</option>
                <option value="score">Sort: Highest Score</option>
                <option value="name">Sort: User Name</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty" style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              <p>{attempts.length === 0 ? 'No attempts yet.' : 'No results match your search.'}</p>
            </div>
          ) : (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr><th>User</th><th>Quiz</th><th>Score</th><th>Correct</th><th>Accuracy</th><th>Time</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => {
                    const pct = a.total_questions > 0 ? Math.round((a.correct_answers / a.total_questions) * 100) : 0
                    return (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 600 }}>{a.username}</td>
                        <td style={{ color: 'var(--ink2)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.quiz_title}</td>
                        <td><span className="pill pill-gold">{a.score} pts</span></td>
                        <td style={{ color: 'var(--ink2)' }}>{a.correct_answers}/{a.total_questions}</td>
                        <td><span className={`pill ${pct >= 70 ? 'pill-pass' : 'pill-fail'}`}>{pct}%</span></td>
                        <td style={{ color: 'var(--ink3)' }}>{a.time_taken}s</td>
                        <td style={{ color: 'var(--ink3)', fontSize: '.83rem', whiteSpace: 'nowrap' }}>
                          {new Date(a.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
