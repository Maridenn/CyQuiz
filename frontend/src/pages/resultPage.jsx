import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import attemptService from '../services/attemptService'

export default function ResultPage() {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    attemptService.getById(attemptId)
      .then(setResult)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [attemptId])

  if (loading) return <div className="spinner" />
  if (!result) return <div className="page-body"><p>Result not found.</p></div>

  const pct  = result.total_questions > 0
    ? Math.round((result.correct_answers / result.total_questions) * 100)
    : 0
  const pass   = pct >= 70
  const R      = 54
  const C      = 2 * Math.PI * R
  const offset = C * (1 - pct / 100)
  const stroke = pass ? 'var(--teal)' : 'var(--red)'
  const wrongAnswers = result.answers?.filter(a => !a.is_correct) || []

  return (
    <div className="result-wrap">
      <div className="result-card fade-in">

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--gold)', marginBottom: '.4rem' }}>
              Quiz Complete
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--ink1)' }}>{result.quiz_title}</h2>
          </div>
          <span className={`pill ${pass ? 'pill-pass' : 'pill-fail'}`} style={{ fontSize: '.88rem', padding: '.4rem 1rem' }}>
            {pass ? '✓ Passed' : '✗ Failed'}
          </span>
        </div>

        <div className="result-hdr">
          <div className="score-circle-wrap">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle className="sc-track" cx="70" cy="70" r={R} />
              <circle className="sc-fill" cx="70" cy="70" r={R}
                stroke={stroke} strokeDasharray={C} strokeDashoffset={offset} />
            </svg>
            <div className="sc-text">
              <div className="sc-num" style={{ color: stroke }}>{pct}%</div>
              <div className="sc-label">Score</div>
            </div>
          </div>
          <div className="result-summary">
            <h2>{pass ? 'Excellent Work!' : 'Keep Practicing!'}</h2>
            <p style={{ marginTop: '.6rem', color: 'var(--ink2)' }}>
              {pass
                ? `You scored ${pct}% — above the 70% passing threshold. Fantastic performance!`
                : `You scored ${pct}%. Review the material and try again!`}
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
              <span className="pill pill-gold">{result.total_questions} Questions</span>
              <span className="pill" style={{ background: 'var(--cream)', color: 'var(--ink3)' }}>Time: {result.time_taken}s</span>
              <span className="pill" style={{ background: 'var(--cream)', color: 'var(--ink3)' }}>{result.score} pts</span>
            </div>
          </div>
        </div>

        <div className="result-grid">
          <div className="rg-box">
            <div className="rg-num">{result.total_questions}</div>
            <div className="rg-lbl">Total</div>
          </div>
          <div className="rg-box">
            <div className="rg-num" style={{ color: 'var(--teal)' }}>{result.correct_answers}</div>
            <div className="rg-lbl">Correct</div>
          </div>
          <div className="rg-box">
            <div className="rg-num" style={{ color: 'var(--red)' }}>{result.total_questions - result.correct_answers}</div>
            <div className="rg-lbl">Incorrect</div>
          </div>
        </div>

        {/* PASS/FAIL MESSAGE */}
        <div className={`result-msg ${pass ? 'pass' : 'fail'}`}>
          <div className="result-msg-body">
            <h3>{pass ? 'Congratulations!' : 'Below passing requirement'}</h3>
            <p>
              {pass
                ? 'Outstanding work! Your achievement has been saved.'
                : 'Your score is below 70%. Review the study resources below and try again.'}
            </p>
          </div>
        </div>

        {wrongAnswers.some(a => a.explanation || a.study_link) && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--ink1)' }}>Topics to be reviewed</h3>
              <span className="pill" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>
                {wrongAnswers.filter(a => a.explanation || a.study_link).length} topics
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
              {wrongAnswers.filter(a => a.explanation || a.study_link).map(a => (
                <div key={a.id} style={{
                  background: 'var(--cream)', border: '1.5px solid var(--border)',
                  borderLeft: '4px solid var(--gold)',
                  borderRadius: 'var(--radius)', padding: '1.1rem 1.25rem',
                }}>
                  <p style={{ fontWeight: 600, fontSize: '.9rem', color: 'var(--ink2)', marginBottom: '.6rem' }}>
                    <span style={{ color: 'var(--gold-dark)', marginRight: '.4rem' }}>Q:</span>
                    {a.question_text}
                  </p>
                  <p style={{ fontSize: '.85rem', marginBottom: a.explanation ? '.6rem' : 0 }}>
                    <span style={{ color: 'var(--teal)', fontWeight: 700 }}>✓ Correct: </span>
                    <span style={{ background: 'var(--teal-light)', border: '1px solid rgba(42,157,143,.3)', color: 'var(--teal)', borderRadius: '6px', padding: '.15rem .5rem', fontSize: '.82rem' }}>
                      {a.correct_answer?.toUpperCase()}: {a[`option_${a.correct_answer}`]}
                    </span>
                  </p>
                  {a.explanation && (
                    <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', padding: '.85rem', fontSize: '.88rem', color: 'var(--ink2)', lineHeight: 1.6, marginTop: '.5rem' }}>
                      <span style={{ color: 'var(--gold-dark)', fontWeight: 700, marginRight: '.3rem' }}>💡 Why?</span>
                      {a.explanation}
                    </div>
                  )}
                  {a.study_link && (
                    <a href={a.study_link} target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: '.75rem', display: 'inline-flex', textDecoration: 'none' }}>
                      Study this topic ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANSWER REVIEW */}
        {result.answers?.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--ink1)', marginBottom: '1rem' }}>Review All Answers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {result.answers.map((a, i) => (
                <div key={a.id} style={{
                  background: 'var(--white)', border: `1.5px solid ${a.is_correct ? 'rgba(42,157,143,.3)' : 'rgba(230,57,70,.3)'}`,
                  borderRadius: 'var(--radius)', padding: '1rem 1.25rem',
                }}>
                  <div style={{ display: 'flex', gap: '.6rem', marginBottom: '.6rem' }}>
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                      background: a.is_correct ? 'var(--teal-light)' : 'var(--red-light)',
                      color: a.is_correct ? 'var(--teal)' : 'var(--red)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '.8rem', fontWeight: 800,
                    }}>
                      {a.is_correct ? '✓' : '✗'}
                    </span>
                    <p style={{ fontWeight: 600, fontSize: '.9rem', lineHeight: 1.5, color: 'var(--ink1)' }}>
                      <span style={{ color: 'var(--ink4)', marginRight: '.4rem' }}>Q{i + 1}.</span>
                      {a.question_text}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', paddingLeft: '1.75rem' }}>
                    {[['a', a.option_a], ['b', a.option_b], ['c', a.option_c], ['d', a.option_d]].map(([val, opt]) => {
                      const isCorrect  = val === a.correct_answer
                      const isSelected = val === a.selected_answer
                      let bg = 'var(--cream)', color = 'var(--ink3)', border = 'var(--border)'
                      if (isCorrect)             { bg = 'var(--teal-light)'; color = 'var(--teal)'; border = 'rgba(42,157,143,.4)' }
                      if (isSelected && !isCorrect) { bg = 'var(--red-light)'; color = 'var(--red)';  border = 'rgba(230,57,70,.4)' }
                      return (
                        <div key={val} style={{ padding: '.25rem .65rem', borderRadius: '6px', background: bg, border: `1px solid ${border}`, color, fontSize: '.8rem', fontWeight: isCorrect ? 700 : 400 }}>
                          {val.toUpperCase()}: {opt}{isCorrect && ' ✓'}{isSelected && !isCorrect && ' ✗'}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="result-actions">
          <button className="btn btn-outline" onClick={() => navigate('/')}>← Back to Dashboard</button>
        </div>
      </div>
    </div>
  )
}
