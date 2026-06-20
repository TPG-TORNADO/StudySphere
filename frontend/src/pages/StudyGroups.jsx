import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Users, ArrowRight } from 'lucide-react'
import * as groupsApi from '../api/groupsApi'
import AlertMessage from '../components/AlertMessage.jsx'
import Loading from '../components/Loading.jsx'
import { getErrorMessage } from '../utils/errors'

export default function StudyGroups() {
  const [allGroups, setAllGroups] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    loadGroups()
  }, [])

  async function loadGroups() {
    setLoading(true)
    setError('')
    try {
      const { data } = await groupsApi.getGroups()
      setAllGroups(data)
      setGroups(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load study groups'))
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(event) {
    const nextQuery = event.target.value
    setQuery(nextQuery)

    const trimmedQuery = nextQuery.trim().toLowerCase()
    if (!trimmedQuery) {
      setGroups(allGroups)
      return
    }

    const filteredGroups = allGroups.filter((group) => {
      const name = group.name?.toLowerCase() || ''
      const description = group.description?.toLowerCase() || ''
      return name.includes(trimmedQuery) || description.includes(trimmedQuery)
    })

    setGroups(filteredGroups)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <section>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
        <div>
          <h1 className="display-6 mb-1">Study Groups</h1>
          <p className="text-secondary mb-0 fs-5">Join collaborative learning spaces designed for your success.</p>
        </div>
        <Link className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" to="/groups/new">
          <Plus size={20} /> Create New Group
        </Link>
      </div>

      <div className="position-relative mb-5">
        <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
          <Search size={20} />
        </div>
        <input
          className="form-control form-control-lg ps-5 border-0 shadow-sm surface"
          type="search"
          placeholder="Search groups by name or description..."
          value={query}
          onChange={handleSearch}
        />
      </div>

      <AlertMessage>{error}</AlertMessage>
      {loading ? <Loading label="Finding active groups..." /> : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="row g-4"
        >
          <AnimatePresence mode="popLayout">
            {groups.map((group) => (
              <div className="col-md-6 col-xl-4" key={group.id}>
                <motion.div 
                  variants={cardVariants}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -8 }}
                  className="surface p-4 h-100 d-flex flex-column"
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="p-2 bg-primary-subtle rounded-3">
                      <Users size={24} className="text-primary" />
                    </div>
                    <span className="badge bg-light text-secondary rounded-pill">Active</span>
                  </div>
                  <h2 className="h4 mb-2">{group.name}</h2>
                  <p className="text-secondary small clamp-3 mb-4 flex-grow-1">{group.description}</p>
                  
                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <div className="small text-muted">
                      By <span className="fw-semibold text-primary">{group.createdBy?.fullName.split(' ')[0]}</span>
                    </div>
                    <Link className="btn btn-link link-primary p-0 text-decoration-none d-flex align-items-center gap-1 fw-bold" to={`/groups/${group.id}`}>
                      View Room <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              </div>
            ))}
          </AnimatePresence>
          
          {query.trim() !== '' && groups.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-12 text-center py-5"
            >
              <div className="surface p-5 max-w-md mx-auto">
                <Search size={48} className="text-muted mb-3 opacity-20" />
                <h3 className="h5 text-secondary">No groups match your search.</h3>
                <p className="small text-muted mb-0">Try different keywords or create a new group.</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </section>
  )
}

