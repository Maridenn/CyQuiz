import { useState } from 'react'

const empty = {
  question_text: '',
  option_a: '', option_b: '', option_c: '', option_d: '',
  correct_answer: 'a',
  points: 10,
  explanation: '',
  study_link: '',
}

export default function QuestionForm({ quizId, initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? {
    ...initial,
    explanation: initial.explanation || '',
    study_link: initial.study_link || '',
  } : { ...empty, quiz_id: quizId })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.question_text || !form.option_a || !form.option_b || !form.option_c || !form.option_d) {
      return setError('Question text and all 4 options are required')
    }
    setLoading(true)
    setError('')
    try {
      await onSave(form)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save question')
    } finally {
      setLoading(false)
    }
  }

  const optionLabels = ['A', 'B', 'C', 'D']
  const optionKeys = ['option_a', 'option_b', 'option_c', 'option_d']
  const optionVals = ['a', 'b', 'c', 'd']

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--cream)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      marginBottom: '1rem',
    }}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="label">Question Text *</label>
        <textarea
          value={form.question_text}
          onChange={e => set('question_text', e.target.value)}
          rows={2}
          placeholder="Enter your question..."
          style={{ resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {optionKeys.map((key, i) => (
          <div key={key}>
            <label className="label">Option {optionLabels[i]} *</label>
            <input
              value={form[key]}
              onChange={e => set(key, e.target.value)}
              placeholder={`Option ${optionLabels[i]}`}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label className="label">Correct Answer *</label>
          <select value={form.correct_answer} onChange={e => set('correct_answer', e.target.value)}>
            {optionVals.map((v, i) => (
              <option key={v} value={v}>Option {optionLabels[i]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Points</label>
          <input
            type="number"
            value={form.points}
            onChange={e => set('points', parseInt(e.target.value) || 10)}
            min={1} max={100}
          />
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', margin: '1.25rem 0', paddingTop: '1.25rem' }}>
        <p style={{ fontSize: '.8rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '1rem' }}>
          Learning Resources
        </p>

        <div className="form-group">
          <label className="label">Explanation</label>
          <textarea
            value={form.explanation}
            onChange={e => set('explanation', e.target.value)}
            rows={3}
            placeholder="Explain why the correct answer is right. e.g. 'HTTP 404 means the resource was not found...'"
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="label">Study Link (URL)</label>
          <input
            type="url"
            value={form.study_link}
            onChange={e => set('study_link', e.target.value)}
            placeholder="https://developer.mozilla.org/..."
          />
          {form.study_link && (
            <a
              href={form.study_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '.78rem', color: 'var(--gold)', display: 'block', marginTop: '.3rem' }}
            >
              ↗ Preview link
            </a>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.25rem' }}>
        <button type="submit" className="btn btn-gold" disabled={loading}>
          {loading ? 'Saving…' : initial ? 'Update Question' : 'Add Question'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  )
}
