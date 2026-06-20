import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, FileText, MessageSquare, Upload, LogIn, LogOut, ArrowLeft, Search, Download, FileJson } from 'lucide-react'
import * as groupsApi from '../api/groupsApi'
import * as resourcesApi from '../api/resourcesApi'
import { useAuth } from '../context/AuthContext.jsx'
import AlertMessage from '../components/AlertMessage.jsx'
import Loading from '../components/Loading.jsx'
import { getErrorMessage } from '../utils/errors'

export default function GroupDetails() {
  const { groupId } = useParams()
  const { user } = useAuth()
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [resources, setResources] = useState([])
  const [resourceQuery, setResourceQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    loadGroup()
  }, [groupId])

  async function loadResources(query = '') {
    try {
      if (query.trim()) {
        const { data } = await resourcesApi.searchResources(query)
        setResources(data.filter((resource) => String(resource.studyGroupId) === String(groupId)))
      } else {
        const { data } = await resourcesApi.getResources(groupId)
        setResources(data)
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load resources'))
    }
  }

  async function loadGroup() {
    setLoading(true)
    setError('')
    try {
      const [groupResult, memberResult] = await Promise.all([
        groupsApi.getGroup(groupId),
        groupsApi.getMembers(groupId)
      ])
      setGroup(groupResult.data)
      setMembers(memberResult.data)
      await loadResources()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load group details'))
    } finally {
      setLoading(false)
    }
  }

  async function joinGroup() {
    setNotice('')
    setError('')
    try {
      await groupsApi.joinGroup(groupId)
      setNotice('Joined successfully!')
      await loadGroup()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not join group'))
    }
  }

  async function leaveGroup() {
    setNotice('')
    setError('')
    try {
      await groupsApi.leaveGroup(groupId)
      setNotice('Left the group.')
      await loadGroup()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not leave group'))
    }
  }

  if (loading) return <Loading label="Entering room..." />
  if (!group) return <AlertMessage>{error || 'Group not found'}</AlertMessage>

  const isMember = members.some((membership) => membership.user.id === user?.id)

  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link to="/groups" className="btn btn-link link-secondary p-0 mb-4 text-decoration-none d-flex align-items-center gap-2 small fw-bold text-uppercase">
        <ArrowLeft size={16} /> Back to Groups
      </Link>

      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4 mb-5">
        <div>
          <div className="d-flex align-items-center gap-3 mb-2">
            <span className="badge bg-primary rounded-pill px-3">Room ID: {groupId}</span>
            <span className="text-muted small">•</span>
            <div className="d-flex align-items-center gap-1 text-muted small">
              <Users size={14} /> {members.length} Members
            </div>
          </div>
          <h1 className="display-6 mb-2">{group.name}</h1>
          <p className="text-secondary fs-5 mb-0 mx-w-3xl">{group.description}</p>
        </div>
        
        <div className="d-flex flex-wrap gap-2">
          {isMember ? (
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={leaveGroup}>
              <LogOut size={18} /> Leave Group
            </button>
          ) : (
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={joinGroup}>
              <LogIn size={18} /> Join Group
            </button>
          )}
          <Link className="btn btn-indigo d-flex align-items-center gap-2" style={{ background: '#6366f1', color: 'white' }} to={`/groups/${groupId}/discussions`}>
            <MessageSquare size={18} /> Discussions
          </Link>
          <Link className="btn btn-emerald d-flex align-items-center gap-2" style={{ background: '#10b981', color: 'white' }} to={`/groups/${groupId}/resources/upload`}>
            <Upload size={18} /> Upload PDF
          </Link>
        </div>
      </div>

      {error && <AlertMessage variant="danger">{error}</AlertMessage>}
      {notice && <AlertMessage variant="success">{notice}</AlertMessage>}

      <div className="row g-4 mt-2">
        <div className="col-lg-4">
          <div className="surface p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Users size={20} className="text-primary" />
              <h2 className="h5 mb-0">Members</h2>
            </div>
            <div className="d-flex flex-column gap-3">
              {members.map((membership) => (
                <div className="d-flex align-items-center gap-3" key={membership.user.id}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(membership.user.fullName)}&background=random&size=40`}
                    alt="Member"
                    className="rounded-circle"
                  />
                  <div>
                    <div className="fw-semibold small">{membership.user.fullName}</div>
                    <div className="text-muted smaller" style={{ fontSize: '0.75rem' }}>{membership.user.email}</div>
                  </div>
                </div>
              ))}
              {members.length === 0 && <div className="text-center py-4 text-muted small">No members found.</div>}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="surface p-4 h-100">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
              <div className="d-flex align-items-center gap-2">
                <FileText size={20} className="text-primary" />
                <h2 className="h5 mb-0">Study Resources</h2>
              </div>
              <div className="position-relative" style={{ minWidth: '240px' }}>
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <Search size={16} />
                </div>
                <input
                  className="form-control form-control-sm ps-5 bg-light border-0"
                  type="search"
                  placeholder="Filter resources..."
                  value={resourceQuery}
                  onChange={(e) => { setResourceQuery(e.target.value); loadResources(e.target.value); }}
                />
              </div>
            </div>

            <div className="list-group list-group-flush border-top-0">
              {resources.map((resource) => (
                <motion.button
                  key={resource.id}
                  whileHover={{ x: 5 }}
                  className="list-group-item list-group-item-action border-0 px-0 py-3 bg-transparent d-flex align-items-center justify-content-between"
                  onClick={async () => {
                    try {
                      const response = await resourcesApi.downloadResource(resource.id)
                      const url = window.URL.createObjectURL(new Blob([response.data]))
                      const link = document.createElement('a')
                      link.href = url
                      link.download = resource.fileName
                      document.body.appendChild(link)
                      link.click()
                      link.remove()
                      window.URL.revokeObjectURL(url)
                    } catch (error) { alert('Download failed') }
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-light rounded-3">
                      <FileJson size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="fw-semibold">{resource.fileName}</div>
                      <div className="text-muted smaller">Uploaded by {resource.uploadedBy?.fullName}</div>
                    </div>
                  </div>
                  <Download size={18} className="text-muted" />
                </motion.button>
              ))}
              {resources.length === 0 && (
                <div className="text-center py-5">
                  <FileText size={48} className="text-muted mb-3 opacity-10" />
                  <p className="text-muted small">No resources found matching "{resourceQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

