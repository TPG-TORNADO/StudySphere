import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, FileText, Camera, Check, AlertCircle, Save, Palette } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { updateProfile, uploadProfileImage } from '../api/userApi'
import { BASE_URL } from '../api/api'
import AlertMessage from '../components/AlertMessage.jsx'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { theme, setTheme, themes } = useTheme()

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const { data } = await updateProfile({ fullName, bio })
      updateUser({ fullName: data.fullName, bio: data.bio })
      setMessage('Profile updated successfully!')
    } catch {
      setMessage('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    // Preview
    const reader = new FileReader()
    reader.onloadend = () => setPreviewImage(reader.result)
    reader.readAsDataURL(file)

    try {
      const { data } = await uploadProfileImage(file)
      updateUser({ profileImage: data.profileImage })
    } catch {
      alert('Upload failed')
      setPreviewImage(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="content-narrow"
    >
      <div className="text-center mb-5">
        <h1 className="display-6 mb-2">My Profile</h1>
        <p className="text-secondary">Personalize your learning experience.</p>
      </div>

      <div className="surface p-0 overflow-hidden shadow-sm shadow-indigo-100">
        <div className="p-4 p-md-5 border-bottom bg-light bg-opacity-10 text-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="position-relative d-inline-block mb-4"
          >
            <img
              src={
                previewImage || (user?.profileImage
                  ? `${BASE_URL}${user.profileImage}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=6366f1&color=fff&size=128`)
              }
              alt="Profile"
              className="rounded-circle border border-4 border-white shadow-lg"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
            />
            <button 
              className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 p-2 shadow"
              onClick={() => fileInputRef.current.click()}
              disabled={loading}
            >
              <Camera size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="d-none"
              accept="image/*"
              onChange={handleProfileImageUpload}
            />
          </motion.div>
          <h2 className="h4 mb-1">{user?.fullName}</h2>
          <div className="d-flex align-items-center justify-content-center gap-2 text-muted small">
            <Mail size={14} /> {user?.email}
          </div>
        </div>

        <div className="p-4 p-md-5">
          {message && (
            <AlertMessage variant={message.includes('successfully') ? 'success' : 'danger'}>
              {message}
            </AlertMessage>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2 small fw-bold text-uppercase text-muted">
                  <User size={14} /> Full Name
                </label>
                <input
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2 small fw-bold text-uppercase text-muted">
                  <FileText size={14} /> Bio
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2 small fw-bold text-uppercase text-muted">
                  <Palette size={14} /> App Theme
                </label>
                <div className="row g-2">
                  {themes.map((option) => (
                    <div className="col-6 col-sm-3" key={option}>
                      <button
                        type="button"
                        className={`btn w-100 text-capitalize ${theme === option ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setTheme(option)}
                      >
                        {option}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-12 mt-5">
                <button type="submit" className="btn btn-primary w-100 py-3 shadow-primary d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                  {loading ? (
                    <div className="spinner-border spinner-border-sm"></div>
                  ) : (
                    <><Save size={18} /> Save Changes</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}