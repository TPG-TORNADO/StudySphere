import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import StudyGroups from './pages/StudyGroups.jsx'
import CreateGroup from './pages/CreateGroup.jsx'
import GroupDetails from './pages/GroupDetails.jsx'
import DiscussionForum from './pages/DiscussionForum.jsx'
import UploadResource from './pages/UploadResource.jsx'
import Profile from './pages/Profile.jsx'
import { useAuth } from './context/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

export default function App() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <main className="container py-5">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><PageWrapper><StudyGroups /></PageWrapper></ProtectedRoute>} />
            <Route path="/groups/new" element={<ProtectedRoute><PageWrapper><CreateGroup /></PageWrapper></ProtectedRoute>} />
            <Route path="/groups/:groupId" element={<ProtectedRoute><PageWrapper><GroupDetails /></PageWrapper></ProtectedRoute>} />
            <Route path="/groups/:groupId/discussions" element={<ProtectedRoute><PageWrapper><DiscussionForum /></PageWrapper></ProtectedRoute>} />
            <Route path="/groups/:groupId/resources/upload" element={<ProtectedRoute><PageWrapper><UploadResource /></PageWrapper></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  )
}
