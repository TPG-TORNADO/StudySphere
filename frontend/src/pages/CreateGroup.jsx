import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, ArrowLeft, Plus, Type, AlignLeft } from 'lucide-react'
import * as groupsApi from '../api/groupsApi'
import AlertMessage from '../components/AlertMessage.jsx'
import { getErrorMessage } from '../utils/errors'

export default function CreateGroup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await groupsApi.createGroup(form)
      navigate(`/groups/${data.id}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create group'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content-narrow">
      <Link to="/groups" className="btn btn-link link-secondary p-0 mb-4 text-decoration-none d-flex align-items-center gap-2 small fw-bold text-uppercase">
        <ArrowLeft size={16} /> Back to Groups
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="surface p-5 shadow-sm"
      >
        <div className="text-center mb-5">
          <div className="mb-4 d-inline-flex bg-indigo-50 text-primary rounded-4 p-3 shadow-sm">
            <Users size={32} />
          </div>
          <h1 className="h3 mb-2">Create a Study Group</h1>
          <p className="text-secondary small">Start a collaborative space for focused learning.</p>
        </div>

        {error && <AlertMessage variant="danger">{error}</AlertMessage>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label d-flex align-items-center gap-2 small fw-bold text-uppercase text-muted mb-2">
              <Type size={14} /> Group Name
            </label>
            <input 
              className="form-control py-2 ps-3 bg-light border-0" 
              name="name" 
              placeholder="e.g. Advanced Calculus Study Pool"
              maxLength="120" 
              value={form.name} 
              onChange={updateField} 
              required 
            />
          </div>
          <div className="mb-5">
            <label className="form-label d-flex align-items-center gap-2 small fw-bold text-uppercase text-muted mb-2">
              <AlignLeft size={14} /> Description
            </label>
            <textarea 
              className="form-control py-2 ps-3 bg-light border-0" 
              name="description" 
              rows="4" 
              placeholder="Describe the goals and topics of this group..."
              maxLength="1000" 
              value={form.description} 
              onChange={updateField} 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-3 shadow-primary d-flex align-items-center justify-content-center gap-2" 
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm"></div>
            ) : (
              <><Plus size={18} /> Create Group Activity</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

