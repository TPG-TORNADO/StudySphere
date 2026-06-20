import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, FileText, MessageSquare, UserPlus, ArrowRight, BookOpen, GraduationCap, Compass } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getDashboardStats } from '../api/dashboardApi'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    groupsJoined: 0,
    resourcesUploaded: 0,
    discussionPosts: 0,
    membersConnected: 0
  })

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await getDashboardStats()
        setStats(data)
      } catch {
        setStats({
          groupsJoined: 0,
          resourcesUploaded: 0,
          discussionPosts: 0,
          membersConnected: 0
        })
      }
    }
    loadStats()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="dashboard"
    >
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-5">
        <motion.div variants={itemVariants}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">Welcome back</span>
          </div>
          <h1 className="display-5 mb-2">Hello, {user?.fullName.split(' ')[0] || 'Learner'}!</h1>
          <p className="text-secondary fs-5 mb-0">Your learning journey continues here.</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="d-flex gap-3">
          <Link className="btn btn-primary d-flex align-items-center gap-2" to="/groups/new">
            <UserPlus size={18} /> Create Group
          </Link>
          <Link className="btn btn-outline-secondary d-flex align-items-center gap-2" to="/groups">
            <Compass size={18} /> Explore
          </Link>
        </motion.div>
      </div>

      <div className="row g-4 mb-5">
        {[
          { label: 'Groups Joined', value: stats.groupsJoined, icon: Users, color: 'indigo' },
          { label: 'Resources', value: stats.resourcesUploaded, icon: FileText, color: 'blue' },
          { label: 'Discussions', value: stats.discussionPosts, icon: MessageSquare, color: 'purple' },
          { label: 'Network', value: stats.membersConnected, icon: GraduationCap, color: 'emerald' }
        ].map((stat, i) => (
          <div className="col-sm-6 col-xl-3" key={i}>
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="surface stat-card p-4 h-100"
            >
              <div className={`d-inline-flex p-3 rounded-4 mb-3 bg-${stat.color}-transparent`} style={{ background: `rgba(99, 102, 241, 0.1)` }}>
                <stat.icon size={24} className="text-primary" />
              </div>
              <div className="text-muted small fw-medium mb-1">{stat.label}</div>
              <div className="h2 fw-bold mb-0">{stat.value}</div>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {[
          { title: 'Study Groups', desc: 'Join focused learning rooms with peers.', link: '/groups', icon: BookOpen },
          { title: 'Discussions', desc: 'Engage in deep academic conversations.', link: '/groups', icon: MessageSquare },
          { title: 'Materials', desc: 'Access curated PDF resources and notes.', link: '/groups', icon: FileText }
        ].map((box, i) => (
          <div className="col-md-4" key={i}>
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="surface p-4 h-100"
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-2 bg-light rounded-3">
                  <box.icon size={20} className="text-secondary" />
                </div>
                <h2 className="h5 mb-0">{box.title}</h2>
              </div>
              <p className="text-secondary small mb-4">{box.desc}</p>
              <Link to={box.link} className="btn btn-link link-primary p-0 text-decoration-none d-flex align-items-center gap-2">
                Get Started <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
