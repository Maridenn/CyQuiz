import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import quizService from '../services/quizService'
import attemptService from '../services/attemptService'

const LABELS = ['A', 'B', 'C', 'D']

export default function QuizPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [started, setStarted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    Promise.all([quizService.getById(id), quizService.getQuestions(id)])
      .then(([q, qs]) => { setQuiz(q); setQuestions(qs); setTimeLeft(q.time_limit) })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    setShowModal(false)
    try {
      const payload = {
        quiz_id: parseInt(id),
        answers: questions.map(q => ({ question_id: q.id, selected_answer: answers[q.id] || null })),
        time_taken: quiz.time_limit - timeLeft,
      }
      const result = await attemptService.submit(payload)
      navigate(`/result/${result.attempt_id}`)
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }, [submitting, answers, questions, id, quiz, timeLeft, navigate])

  useEffect(() => {
    if (!started || timeLeft === null) return
    if (timeLeft <= 0) { setExpired(true); setTimeout(() => handleSubmit(), 1800); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [started, timeLeft, handleSubmit])

  if (loading) return <div className="spinner" />
  if (!quiz) return null

  const tot = questions.length
  const q   = questions[current]
  const ansCount = Object.keys(answers).length
  const pct = tot > 0 ? Math.round((ansCount / tot) * 100) : 0

  // Circular timer
  const R = 18, C = 2 * Math.PI * R
  const total = quiz.time_limit
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const ss = String((timeLeft || 0) % 60).padStart(2, '0')
  const timerCls = timeLeft < 10 ? 'danger' : timeLeft < 30 ? 'warn' : ''
  const dashOffset = C * (1 - (timeLeft || 0) / total)

  if (!started) {
    return (
      <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--cream)' }}>
        <div className="card fade-in" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--ink1)', marginBottom: '.5rem' }}>{quiz.title}</div>
          {quiz.description && <p style={{ color: 'var(--ink3)', marginBottom: '1.5rem' }}>{quiz.description}</p>}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <InfoBox label="Questions" val={tot} />
            <InfoBox label="Time Limit" val={`${quiz.time_limit}s`} />
          </div>
          {tot === 0 ? (
            <p style={{ color: 'var(--red)' }}>This quiz has no questions yet.</p>
          ) : (
            <button className="btn btn-gold" style={{ padding: '.85rem 2.5rem', fontSize: '1rem' }} onClick={() => setStarted(true)}>
              Start Quiz →
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* EXPIRED OVERLAY */}
      {expired && (
        <div className="overlay">
          <div className="modal" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏰</div>
            <div className="modal-title">Time's Up!</div>
            <div className="modal-body">Your answers are being submitted automatically…</div>
          </div>
        </div>
      )}

      {/* SUBMIT MODAL */}
      {showModal && !expired && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-title">Submit Quiz?</div>
            <div className="modal-body">
              You've answered {ansCount} of {tot} questions.
              {ansCount < tot && ` ${tot - ansCount} left unanswered.`} Ready to submit?
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" style={{ flex: 1 }} onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Now →'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="quiz-shell">
        {/* HEADER */}
        <div className="quiz-hdr">
          <div className="quiz-hdr-left">
            <div className="quiz-hdr-title">{quiz.title}</div>
            <div className="quiz-hdr-info">Question {current + 1} of {tot} · {ansCount} answered</div>
          </div>

          <div className="quiz-progress-wrap">
            <div className="quiz-prog-label"><span>Progress</span><span>{pct}%</span></div>
            <div className="prog-track"><div className="prog-fill" style={{ width: pct + '%' }} /></div>
          </div>

          <div className="timer-box">
            <div className="timer-ring-wrap">
              <svg width="44" height="44" viewBox="0 0 44 44">
                <circle className="t-track" cx="22" cy="22" r={R} />
                <circle className={`t-fill${timerCls ? ' ' + timerCls : ''}`} cx="22" cy="22" r={R}
                  strokeDasharray={C} strokeDashoffset={dashOffset} />
              </svg>
            </div>
            <div className={`timer-time${timerCls ? ' ' + timerCls : ''}`}>{mm}:{ss}</div>
          </div>
        </div>

        {/* BODY */}
        <div className="quiz-body">
          <div className="quiz-main">
            {q && (
              <>
                <div className="q-num">Question {current + 1} / {tot}</div>
                <div className="q-text">{q.question_text}</div>
                <div className="opts">
                  {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, i) => {
                    const val = ['a','b','c','d'][i]
                    const selected = answers[q.id] === val
                    return (
                      <button
                        key={i}
                        className={`opt${selected ? ' sel' : ''}`}
                        onClick={() => setAnswers(a => ({ ...a, [q.id]: val }))}
                      >
                        <span className="opt-lbl">{LABELS[i]}</span>
                        <span>{opt}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="quiz-nav-row">
                  <button className="btn btn-outline" onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>
                    ← Previous
                  </button>
                  {current < tot - 1
                    ? <button className="btn btn-gold" onClick={() => setCurrent(c => c + 1)}>Next Question →</button>
                    : <button className="btn btn-gold" onClick={() => setShowModal(true)} disabled={submitting}>Submit Quiz ✓</button>
                  }
                </div>
              </>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="quiz-sidebar">
            <div className="qs-title">Questions</div>
            <div className="qs-grid">
              {questions.map((_, i) => {
                const isCur = i === current
                const isAns = answers[questions[i]?.id] !== undefined
                return (
                  <button key={i} className="qs-dot" onClick={() => setCurrent(i)}
                    style={{
                      borderColor: isCur ? 'var(--gold)' : isAns ? 'var(--teal)' : 'var(--border)',
                      background:  isCur ? 'var(--gold-light)' : isAns ? 'var(--teal-light)' : 'var(--white)',
                      color:       isCur ? 'var(--gold-dark)' : isAns ? 'var(--teal)' : 'var(--ink3)',
                    }}>
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <div className="qs-legend">
              <div className="qs-leg-row"><div className="qs-leg-dot" style={{ background: 'var(--gold-light)', border: '1.5px solid var(--gold)' }} />Current</div>
              <div className="qs-leg-row"><div className="qs-leg-dot" style={{ background: 'var(--teal-light)', border: '1.5px solid var(--teal)' }} />Answered</div>
              <div className="qs-leg-row"><div className="qs-leg-dot" style={{ background: 'var(--white)',     border: '1.5px solid var(--border)' }} />Unanswered</div>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <button className="btn btn-outline btn-full" style={{ fontSize: '.82rem' }} onClick={() => setShowModal(true)}>
                Submit Quiz ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function InfoBox({ label, val }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink1)' }}>{val}</div>
      <div style={{ fontSize: '.75rem', color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.07em' }}>{label}</div>
    </div>
  )
}
