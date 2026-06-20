import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check } from 'lucide-react'
import * as notificationApi from '../api/notificationApi'

export default function NotificationBadge() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)

  const fetchStats = async () => {
    try {
      const { data: count } = await notificationApi.getUnreadCount()
      setUnreadCount(count)
    } catch (err) { console.error(err) }
  }

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationApi.getNotifications()
      setNotifications(data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const toggleDropdown = () => {
    if (!showDropdown) fetchNotifications()
    setShowDropdown(!showDropdown)
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id)
      setUnreadCount(prev => Math.max(0, prev - 1))
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (err) { console.error(err) }
  }

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      await handleMarkAsRead(n.id)
    }
    
    setShowDropdown(false)

    switch (n.targetType) {
      case 'GROUP':
        navigate(`/groups/${n.targetId}`)
        break
      case 'DISCUSSION':
        navigate(`/groups/${n.targetParentId}/discussions`)
        break
      case 'RESOURCE':
        navigate(`/groups/${n.targetParentId}?resourceId=${n.targetId}`)
        break
      default:
        console.warn('Unknown notification target type:', n.targetType)
    }
  }

  return (
    <div className="position-relative">
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="btn btn-link link-secondary p-2 border-0 bg-transparent rounded-circle position-relative hover-bg-light" 
        onClick={toggleDropdown}
      >
        <Bell size={20} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white" 
              style={{fontSize: '0.65rem', minWidth: '1.2rem', height: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="dropdown-menu show position-absolute end-0 mt-3 p-0 shadow-lg surface overflow-hidden" 
            style={{ width: '320px', maxHeight: '480px', zIndex: 1050 }}
          >
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top">
              <span className="fw-bold">Notifications</span>
              <span className="badge bg-primary-subtle text-primary rounded-pill">{unreadCount} Unread</span>
            </div>
            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
              {notifications.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  <Bell size={32} className="mb-2 opacity-20" />
                  <div className="small">All caught up!</div>
                </div>
              ) : (
                notifications.map(n => (
                  <motion.div 
                    key={n.id} 
                    whileHover={{ backgroundColor: 'var(--surface-muted)' }}
                    className="p-3 border-bottom small transition-colors"
                    onClick={() => handleNotificationClick(n)}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: !n.isRead ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                    }}
                  >
                    <div className="d-flex gap-3">
                      <div className="flex-grow-1">
                        <div className={!n.isRead ? 'fw-bold mb-1' : 'mb-1 text-secondary'}>{n.message}</div>
                        <div className="text-muted" style={{fontSize: '0.7rem'}}>
                          {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {!n.isRead && <div className="p-1"><div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div></div>}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-2 border-top text-center bg-light">
                <button className="btn btn-link btn-sm text-decoration-none py-0">View All</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
