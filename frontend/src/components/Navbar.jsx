import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, User as UserIcon, Bell, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import NotificationBadge from './NotificationBadge.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg sticky-top glass py-2">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fs-4" to="/">
          <div className="bg-primary rounded-3 p-1 d-flex">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            StudySphere
          </span>
        </Link>
        
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav ms-auto me-auto gap-1">
            {user && (
              <>
                <NavLink className="nav-link px-3 d-flex align-items-center gap-2" end to="/">
                  <LayoutDashboard size={18} /> Dashboard
                </NavLink>
                <NavLink className="nav-link px-3 d-flex align-items-center gap-2" to="/groups">
                  <Users size={18} /> Study Groups
                </NavLink>
                <NavLink className="nav-link px-3 d-flex align-items-center gap-2" to="/profile">
                  <UserIcon size={18} /> Profile
                </NavLink>
              </>
            )}
          </div>
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <NotificationBadge />
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="d-flex align-items-center gap-2"
                >
                  <img
                    src={
                      user.profileImage
                        ? `http://localhost:8080${user.profileImage}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.fullName
                          )}&background=random`
                    }
                    alt="Profile"
                    className="navbar-avatar"
                    onClick={() => navigate('/profile')}
                  />
                  <div className="d-none d-xl-block">
                    <div className="small fw-semibold leading-none">{user.fullName}</div>
                  </div>
                </motion.div>
                <button 
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2" 
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> <span className="d-none d-sm-inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="d-flex gap-2">
                <NavLink className="btn btn-link link-secondary text-decoration-none btn-sm" to="/login">Login</NavLink>
                <NavLink className="btn btn-primary btn-sm px-4" to="/register">Register</NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
