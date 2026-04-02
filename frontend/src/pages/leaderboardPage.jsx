import { useState, useEffect } from 'react'
import { useAuth } from '../App'
import leaderboardService from '../services/leaderboardService'

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    leaderboardService.getGlobal()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const medals = ['🥇', '🥈', '🥉']

  if (loading) return <div className="spinner" />

  return (
    <div className="page-wrap fade-in" style={{ maxWidth: 760 }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '.4rem' }}>Leaderboard</h1>
        <p style={{ color: 'var(--text2)' }}>Top scorers across all quizzes</p>
      </div>

      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text2)' }}>
          <p style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🏜️</p>
          <p>No scores yet. Be the first to complete a quiz!</p>
        </div>
      ) : (
        <div>
          {/* Top 3 podium */}
          {data.slice(0, 3).length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {data.slice(0, 3).map((p, i) => (
                <div key={p.id} style={{
                  flex: '1 1 180px',
                  maxWidth: '220px',
                  background: 'var(--surface)',
                  border: `2px solid ${i === 0 ? 'gold' : i === 1 ? 'silver' : '#cd7f32'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  transform: i === 0 ? 'scale(1.05)' : 'scale(1)',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>{medals[i]}</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '.25rem' }}>{p.username}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>
                    {p.total_score} pts
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text3)', marginTop: '.3rem' }}>
                    {p.total_attempts} attempt{p.total_attempts !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full rankings table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                  {['Rank', 'Player', 'Total Score', 'Best Score', 'Avg Score', 'Attempts'].map(h => (
                    <th key={h} style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.75rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.07em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((p, i) => {
                  const isMe = p.id === user?.id
                  return (
                    <tr key={p.id} style={{
                      borderBottom: '1px solid var(--border)',
                      background: isMe ? 'rgba(91,127,255,.07)' : 'transparent',
                    }}>
                      <td style={{ padding: '.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>
                        {medals[i] || `#${i + 1}`}
                      </td>
                      <td style={{ padding: '.85rem 1rem', fontWeight: 700 }}>
                        {p.username}
                        {isMe && <span style={{ color: 'var(--accent)', marginLeft: '.4rem', fontSize: '.75rem' }}>(you)</span>}
                      </td>
                      <td style={{ padding: '.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 700 }}>
                        {p.total_score}
                      </td>
                      <td style={{ padding: '.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--warn)' }}>
                        {p.best_score}
                      </td>
                      <td style={{ padding: '.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text2)' }}>
                        {Math.round(p.avg_score)}
                      </td>
                      <td style={{ padding: '.85rem 1rem', color: 'var(--text2)' }}>
                        {p.total_attempts}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
