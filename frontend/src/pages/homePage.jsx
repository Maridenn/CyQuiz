import { useState, useEffect } from 'react'
import { useAuth } from '../App'
import { Link } from 'react-router-dom'
import quizService from '../services/quizService'
import attemptService from '../services/attemptService'

export default function HomePage() {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('quizzes')

  useEffect(() => {
    Promise.all([quizService.getAll(), attemptService.getMyAttempts()])
      .then(([q, a]) => { setQuizzes(q); setAttempts(a) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalScore = attempts.reduce((s, a) => s + a.score, 0)
  const bestScore  = attempts.length ? Math.max(...attempts.map(a => a.score)) : 0
  const avgPct     = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + (a.correct_answers / (a.total_questions || 1)), 0) / attempts.length * 100)
    : 0

  if (loading) return <div className="spinner" />

  return (
    <div className="page-body fade-in">
      {/* HERO */}
      <div className="hero-row" style={{ marginBottom: '1.75rem' }}>
        <div>
          <div className="hero-title">Ready to test your <em>knowledge</em>?</div>
          <div className="hero-sub">
            Choose from the {quizzes.length} quizzes{quizzes.length !== 1 ? 'zes' : ''}.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', alignItems: 'flex-end', zIndex: 1 }}>
          <button className="btn btn-gold" onClick={() => setTab('quizzes')}>Browse Quizzes →</button>
          {attempts.length > 0 && (
            <button
              className="btn btn-outline"
              style={{ background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.75)', borderColor: 'rgba(255,255,255,.15)' }}
              onClick={() => setTab('results')}
            >
              View My Results
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--gold)' }}>{quizzes.length}</div>
          <div className="stat-lbl">Available Quizzes</div>
          <span className="stat-badge" style={{ background: 'var(--gold-light)', color: 'var(--gold-dark)' }}>ready to take</span>
        </div>
        <div className="stat-card">
          <div className="stat-num">{attempts.length}</div>
          <div className="stat-lbl">Attempts Made</div>
          <span className="stat-badge" style={{ background: 'var(--cream)', color: 'var(--ink3)' }}>all time</span>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--teal)' }}>{totalScore}</div>
          <div className="stat-lbl">Total Score</div>
          <span className="stat-badge" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>cumulative</span>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: avgPct >= 70 ? 'var(--teal)' : avgPct > 0 ? '#e67e22' : 'var(--ink3)' }}>
            {avgPct ? avgPct + '%' : '—'}
          </div>
          <div className="stat-lbl">Avg Accuracy</div>
          <span className="stat-badge" style={{ background: 'var(--cream)', color: 'var(--ink3)' }}>
            {avgPct >= 70 ? 'above pass' : avgPct > 0 ? 'below pass' : 'no attempts'}
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button className={`tab${tab === 'quizzes' ? ' on' : ''}`} onClick={() => setTab('quizzes')}>
          Available Quizzes ({quizzes.length})
        </button>
        <button className={`tab${tab === 'results' ? ' on' : ''}`} onClick={() => setTab('results')}>
          My Results {attempts.length ? `(${attempts.length})` : ''}
        </button>
      </div>

      {tab === 'quizzes' && (
        quizzes.length === 0 ? (
          <div className="empty">
            <p>No quizzes available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="quiz-grid fade">
            {quizzes.map(q => <QuizCard key={q.id} quiz={q} />)}
          </div>
        )
      )}

      {tab === 'results' && (
        <div className="fade">
          {attempts.length === 0 ? (
            <div className="empty">
              <p>No attempts yet. Start a quiz!</p>
            </div>
          ) : (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr><th>Quiz</th><th>Score</th><th>Correct</th><th>Time</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {[...attempts].reverse().map((a, i) => {
                    const pct = a.total_questions > 0 ? Math.round((a.correct_answers / a.total_questions) * 100) : 0
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{a.quiz_title}</td>
                        <td><span className={`pill ${pct >= 70 ? 'pill-pass' : 'pill-fail'}`}>{a.score} pts</span></td>
                        <td style={{ color: 'var(--ink2)' }}>{a.correct_answers} / {a.total_questions}</td>
                        <td style={{ color: 'var(--ink3)' }}>{a.time_taken}s</td>
                        <td style={{ color: 'var(--ink3)', fontSize: '.85rem' }}>
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
      )}
    </div>
  )
}

function QuizCard({ quiz }) {
  return (
    <div className="qcard">
      <div className="qcard-cat">Quiz</div>
      <div className="qcard-title">{quiz.title}</div>
      <div className="qcard-desc">{quiz.description || 'No description provided.'}</div>
      <div className="qcard-meta">
        <span>{quiz.question_count || 0} questions</span>
        <span>time: {quiz.time_limit}s</span>
      </div>
      <Link to={`/quiz/${quiz.id}`} className="btn btn-gold btn-sm" style={{ textAlign: 'center' }}>
        Start Quiz →
      </Link>
    </div>
  )
}
