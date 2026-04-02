import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../App'
import quizService from '../services/quizService'
import QuestionForm from '../components/questionForm'
import AdminSidebar from '../components/adminSidebar'

export default function AdminCreateQuiz() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState({ title: '', description: '', time_limit: 60, is_published: true })
  const [questions, setQuestions] = useState([])
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showQForm, setShowQForm] = useState(false)
  const [editingQ, setEditingQ] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    Promise.all([quizService.getById(id), quizService.getQuestions(id)])
      .then(([q, qs]) => {
        setQuiz(q)
        setForm({ title: q.title, description: q.description || '', time_limit: q.time_limit, is_published: q.is_published })
        setQuestions(qs)
      })
      .catch(() => navigate('/admin'))
      .finally(() => setLoading(false))
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSaveQuiz = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Title is required')
    setSaving(true); setError(''); setSuccess('')
    try {
      if (isEdit) {
        await quizService.update(id, form)
        setSuccess('Quiz updated!')
      } else {
        const created = await quizService.create({ ...form, created_by: user.id })
        navigate(`/admin/quiz/${created.id}/edit`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quiz')
    } finally {
      setSaving(false)
    }
  }

  const handleAddQuestion = async (qData) => {
    const q = await quizService.createQuestion({ ...qData, quiz_id: parseInt(id) })
    setQuestions(qs => [...qs, q])
    setShowQForm(false)
  }

  const handleUpdateQuestion = async (qData) => {
    const q = await quizService.updateQuestion(editingQ.id, qData)
    setQuestions(qs => qs.map(x => x.id === q.id ? q : x))
    setEditingQ(null)
  }

  const handleDeleteQuestion = async (qId) => {
    if (!confirm('Delete this question?')) return
    await quizService.deleteQuestion(qId)
    setQuestions(qs => qs.filter(q => q.id !== qId))
  }

  if (loading) return <div className="spinner" />

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
      <div className="page-body fade-in" style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/admin" className="btn btn-outline btn-sm">← Back</Link>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--ink1)' }}>{isEdit ? 'Edit Quiz' : 'New Quiz'}</h1>
          {quiz && <p style={{ color: 'var(--ink3)', fontSize: '.85rem' }}>ID: {quiz.id}</p>}
        </div>
      </div>

      {/* Quiz details form */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.25rem', color: 'var(--ink1)' }}>Quiz Details</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSaveQuiz}>
          <div className="form-group">
            <label className="label">Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. JavaScript Fundamentals" required />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Brief description of the quiz..."
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="label">Time Limit (seconds)</label>
              <input type="number" value={form.time_limit} onChange={e => set('time_limit', parseInt(e.target.value) || 60)} min={10} max={3600} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '.6rem', cursor: 'pointer', paddingBottom: '.65rem' }}>
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={e => set('is_published', e.target.checked)}
                  style={{ width: 'auto', accentColor: 'var(--accent)' }}
                />
                <span style={{ fontSize: '.9rem', color: form.is_published ? 'var(--success)' : 'var(--danger)' }}>
                  {form.is_published ? '✓ Published — visible to users' : '✗ Draft — hidden from users'}
                </span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-gold" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Update Quiz' : 'Create Quiz'}
          </button>
        </form>
      </div>

      {/* Questions section*/}
      {isEdit && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>
              Questions <span style={{ color: 'var(--gold-dark)', fontFamily: 'var(--font-mono)' }}>({questions.length})</span>
            </h2>
            <button className="btn btn-gold btn-sm" onClick={() => { setShowQForm(true); setEditingQ(null) }}>
              + Add Question
            </button>
          </div>

          {showQForm && !editingQ && (
            <QuestionForm
              quizId={parseInt(id)}
              onSave={handleAddQuestion}
              onCancel={() => setShowQForm(false)}
            />
          )}

          {questions.length === 0 && !showQForm ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--ink3)' }}>
              <p style={{ marginBottom: '1rem' }}>No questions yet. Add your first question!</p>
              <button className="btn btn-gold btn-sm" onClick={() => setShowQForm(true)}>+ Add Question</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {questions.map((q, i) => (
                <div key={q.id}>
                  {editingQ?.id === q.id ? (
                    <QuestionForm initial={q} quizId={parseInt(id)} onSave={handleUpdateQuestion} onCancel={() => setEditingQ(null)} />
                  ) : (
                    <div className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, marginBottom: '.75rem' }}>
                            <span style={{ color: 'var(--ink4)', fontFamily: 'var(--font-mono)', marginRight: '.5rem' }}>Q{i + 1}.</span>
                            {q.question_text}
                          </p>
                          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                            {[['a', q.option_a], ['b', q.option_b], ['c', q.option_c], ['d', q.option_d]].map(([val, opt]) => (
                              <span key={val} style={{
                                padding: '.25rem .65rem',
                                borderRadius: '6px',
                                fontSize: '.8rem',
                                fontFamily: 'var(--font-mono)',
                                background: val === q.correct_answer ? 'rgba(42,157,143,.1)' : 'var(--cream)',
                                border: `1px solid ${val === q.correct_answer ? 'rgba(42,157,143,.3)' : 'var(--border)'}`,
                                color: val === q.correct_answer ? 'var(--success)' : 'var(--text3)',
                                fontWeight: val === q.correct_answer ? 700 : 400,
                              }}>
                                {val.toUpperCase()}: {opt} {val === q.correct_answer && '✓'}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '.5rem', flexShrink: 0, alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.8rem', color: 'var(--gold-dark)' }}>{q.points}pts</span>
                          <button className="btn btn-outline btn-sm" onClick={() => { setEditingQ(q); setShowQForm(false) }}>Edit</button>
                          <button className="btn btn-red btn-sm" onClick={() => handleDeleteQuestion(q.id)}>Del</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isEdit && (
        <p style={{ color: 'var(--ink3)', fontSize: '.85rem', textAlign: 'center', marginTop: '1rem' }}>
          Save the quiz first to start adding questions
        </p>
      )}
    </div>
    </main>
    </div>
  )
}
