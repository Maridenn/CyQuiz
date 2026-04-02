import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'

export default function NavBar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/login') }
  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Cy<span>Quiz</span>
      </Link>
      <div className="navbar-right">
        {user ? (
          <>
            <NavItem to="/" active={isActive('/')}>Home</NavItem>
            {isAdmin && <NavItem to="/admin" active={location.pathname.startsWith('/admin')}>Admin</NavItem>}
            <span className="pill pill-gold" style={{ fontSize: '.8rem' }}>Welcome! {user.username}</span>
            <button className="btn btn-outline btn-sm" style={{ color: 'rgba(255,255,255,.75)', borderColor: 'rgba(255,255,255,.2)' }} onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-gold btn-sm">Login</Link>
        )}
      </div>
    </nav>
  )
}

function NavItem({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: '.35rem .85rem',
      borderRadius: '6px',
      fontSize: '.88rem',
      fontWeight: active ? 700 : 500,
      color: active ? 'var(--gold)' : 'rgba(255,255,255,.65)',
      background: active ? 'rgba(201,168,76,.12)' : 'transparent',
      textDecoration: 'none',
      transition: 'all .15s',
    }}>
      {children}
    </Link>
  )
}
