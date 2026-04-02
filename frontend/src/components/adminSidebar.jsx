import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

export default function AdminSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="admin-sidebar">
      <div className="sb-brand">
        <div className="sb-logo">Cy<span>Quiz</span></div>
        <div className="sb-tagline">Admin Panel</div>
      </div>
      <nav className="sb-nav">
        <div className="sb-section">Manage</div>
        <NavLink to="/admin" end className={({ isActive }) => `sb-item${isActive ? ' active' : ''}`}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/quiz/new" className={({ isActive }) => `sb-item${isActive ? ' active' : ''}`}>
          Create Quiz
        </NavLink>
        <NavLink to="/admin/scores" className={({ isActive }) => `sb-item${isActive ? ' active' : ''}`}>
          All Scores
        </NavLink>
        <div className="sb-section">Site</div>
        <span className="sb-item" onClick={() => navigate('/')}>
          View Site
        </span>
      </nav>
      <div className="sb-bottom">
        <div className="sb-user">
          <div className="sb-avatar">{(user?.username || 'A')[0].toUpperCase()}</div>
          <div>
            <div className="sb-uname">{user?.username}</div>
            <div className="sb-uemail">{user?.email}</div>
          </div>
        </div>
        <button className="btn btn-outline btn-full btn-sm"
          style={{ marginTop: '.75rem', color: 'rgba(255,255,255,.6)', borderColor: 'rgba(255,255,255,.15)' }}
          onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
