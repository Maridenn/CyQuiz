import { Link } from 'react-router-dom'

export default function QuizCard({ quiz, onDelete, isAdmin }) {
  return (
    <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '.3rem', color: 'var(--text)' }}>
            {quiz.title}
          </h3>
          <p style={{ fontSize: '.85rem', color: 'var(--text2)', lineHeight: 1.5 }}>
            {quiz.description || 'No description provided.'}
          </p>
        </div>
        {!quiz.is_published && (
          <span className="badge badge-danger" style={{ marginLeft: '.75rem', flexShrink: 0 }}>Draft</span>
        )}
        {quiz.is_published && (
          <span className="badge badge-success" style={{ marginLeft: '.75rem', flexShrink: 0 }}>Live</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', fontSize: '.8rem', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
        <span>{quiz.question_count || 0} questions</span>
        <span>time: {quiz.time_limit}s limit</span>
        {quiz.creator_name && <span>👤 {quiz.creator_name}</span>}
      </div>

      <div style={{ display: 'flex', gap: '.6rem', marginTop: 'auto' }}>
        <Link to={`/quiz/${quiz.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
          Start Quiz
        </Link>
        {isAdmin && (
          <>
            <Link to={`/admin/quiz/${quiz.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete && onDelete(quiz.id)}>Del</button>
          </>
        )}
      </div>
    </div>
  )
}
