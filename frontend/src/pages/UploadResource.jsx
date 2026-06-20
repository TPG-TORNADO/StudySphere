import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, ArrowLeft, FileText, AlertCircle } from 'lucide-react'
import * as resourcesApi from '../api/resourcesApi'
import AlertMessage from '../components/AlertMessage.jsx'
import { getErrorMessage } from '../utils/errors'

export default function UploadResource() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!file) {
      setError('Please select a PDF file to upload.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await resourcesApi.uploadResource(groupId, file)
      navigate(`/groups/${groupId}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not upload resource.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content-narrow">
      <Link to={`/groups/${groupId}`} className="btn btn-link link-secondary p-0 mb-4 text-decoration-none d-flex align-items-center gap-2 small fw-bold text-uppercase">
        <ArrowLeft size={16} /> Back to Group
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="surface p-5 text-center shadow-sm"
      >
        <div className="mb-4 d-inline-flex bg-indigo-50 text-primary rounded-circle p-4">
          <Upload size={40} />
        </div>
        <h1 className="h3 mb-2">Upload Resource</h1>
        <p className="text-secondary small mb-5">Share study materials with your group members.</p>
        
        {error && <AlertMessage variant="danger"><AlertCircle size={18} className="me-2" />{error}</AlertMessage>}

        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-5">
            <label className="form-label d-flex align-items-center gap-2 small fw-bold text-uppercase text-muted mb-3">
              <FileText size={14} /> PDF File
            </label>
            <div 
              className={`p-5 border-2 border-dashed rounded-4 d-flex flex-column align-items-center gap-3 transition-all ${file ? 'border-primary bg-primary bg-opacity-5' : 'border-light'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <FileText size={32} className={file ? 'text-primary' : 'text-muted'} />
              <div className="text-center">
                <div className="fw-semibold">{file ? file.name : 'Click to select a PDF'}</div>
                <div className="text-muted smaller">Max size: 10MB</div>
              </div>
              <input 
                id="file-input"
                type="file" 
                className="d-none"
                accept="application/pdf,.pdf" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                required 
              />
            </div>
          </div>
          
          <button 
            className="btn btn-primary w-100 py-3 shadow-primary d-flex align-items-center justify-content-center gap-2" 
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm"></div>
            ) : (
              <><Upload size={18} /> Upload PDF to Group</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

