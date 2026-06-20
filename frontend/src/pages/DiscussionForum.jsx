import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Trash2, ArrowLeft, User, Clock, PlusCircle } from 'lucide-react'
import * as discussionsApi from '../api/discussionsApi'
import * as groupsApi from '../api/groupsApi'
import AlertMessage from '../components/AlertMessage.jsx'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getErrorMessage } from '../utils/errors'

function formatTimestamp(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

export default function DiscussionForum() {
  const { groupId } = useParams()
  const { user } = useAuth()
  const [group, setGroup] = useState(null)
  const [posts, setPosts] = useState([])
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [comments, setComments] = useState([])
  const [postForm, setPostForm] = useState({ title: '', content: '' })
  const [commentForm, setCommentForm] = useState({ content: '' })
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadForum()
  }, [groupId])

  useEffect(() => {
    if (selectedPostId) {
      loadComments(selectedPostId)
    }
  }, [selectedPostId])

  async function loadForum() {
    setLoading(true)
    setError('')
    try {
      const [groupResult, postsResult] = await Promise.all([
        groupsApi.getGroup(groupId),
        discussionsApi.getPosts(groupId)
      ])
      setGroup(groupResult.data)
      setPosts(postsResult.data)
      setSelectedPostId(postsResult.data[0]?.id || null)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load forum'))
    } finally {
      setLoading(false)
    }
  }

  async function loadComments(postId) {
    try {
      const { data } = await discussionsApi.getComments(postId)
      setComments(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load comments'))
    }
  }

  async function createPost(event) {
    event.preventDefault()
    setError('')
    try {
      const { data } = await discussionsApi.createPost(groupId, postForm)
      setPosts([data, ...posts])
      setPostForm({ title: '', content: '' })
      setSelectedPostId(data.id)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create post'))
    }
  }

  async function addComment(event) {
    event.preventDefault()
    if (!selectedPostId) return
    setError('')
    try {
      const { data } = await discussionsApi.addComment(selectedPostId, commentForm)
      setComments([...comments, data])
      setCommentForm({ content: '' })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not add comment'))
    }
  }

  async function deleteSelectedPost() {
    if (!selectedPostId || !window.confirm('Delete this post and all of its replies?')) return
    setDeleting(true)
    setError('')
    try {
      await discussionsApi.deletePost(selectedPostId)
      const remainingPosts = posts.filter((post) => post.id !== selectedPostId)
      setPosts(remainingPosts)
      setSelectedPostId(remainingPosts[0]?.id || null)
      setComments([])
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete post'))
    } finally {
      setDeleting(false)
    }
  }

  const selectedPost = posts.find((post) => post.id === selectedPostId)

  if (loading) return <Loading label="Syncing discussions..." />

  return (
    <motion.section 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pb-5"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to={`/groups/${groupId}`} className="btn btn-link link-secondary p-0 mb-2 text-decoration-none d-flex align-items-center gap-2 small fw-bold text-uppercase">
            <ArrowLeft size={16} /> Back to Group
          </Link>
          <h1 className="h3 mb-0 d-flex align-items-center gap-2">
            <MessageSquare className="text-primary" /> Discussion Forum
          </h1>
          <p className="text-secondary small mb-0">{group?.name}</p>
        </div>
      </div>

      {error && <AlertMessage variant="danger">{error}</AlertMessage>}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="surface p-4 mb-4">
            <h2 className="h6 fw-bold text-uppercase text-muted d-flex align-items-center gap-2 mb-4">
              <PlusCircle size={16} /> New Discussion
            </h2>
            <form onSubmit={createPost}>
              <div className="mb-3">
                <input 
                  className="form-control form-control-sm bg-light border-0" 
                  placeholder="Topic title..." 
                  value={postForm.title} 
                  maxLength="160" 
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} 
                  required 
                />
              </div>
              <div className="mb-3">
                <textarea 
                  className="form-control form-control-sm bg-light border-0" 
                  rows="3" 
                  placeholder="What's on your mind?" 
                  value={postForm.content} 
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })} 
                  required 
                />
              </div>
              <button className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
                <Send size={14} /> Post Discussion
              </button>
            </form>
          </div>

          <div className="surface p-0 overflow-hidden">
            <div className="p-4 border-bottom bg-light bg-opacity-10">
              <h2 className="h6 fw-bold text-uppercase text-muted mb-0">Recent Topics</h2>
            </div>
            <div className="list-group list-group-flush scroll-area" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {posts.map((post) => (
                <button
                  className={`list-group-item list-group-item-action border-0 px-4 py-3 ${post.id === selectedPostId ? 'bg-primary-subtle border-start border-4 border-primary' : ''}`}
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                >
                  <div className="fw-semibold mb-1">{post.title}</div>
                  <div className="d-flex align-items-center gap-2 text-muted smaller">
                    <User size={12} /> {post.author?.fullName}
                  </div>
                </button>
              ))}
              {posts.length === 0 && <div className="p-4 text-center text-muted small">No discussions yet.</div>}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <AnimatePresence mode="wait">
            {selectedPost ? (
              <motion.div 
                key={selectedPost.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="surface p-4 p-md-5 h-100"
              >
                <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
                  <div>
                    <h2 className="h3 mb-2">{selectedPost.title}</h2>
                    <div className="d-flex align-items-center gap-3 text-muted small">
                      <div className="d-flex align-items-center gap-1"><User size={14} /> {selectedPost.author?.fullName}</div>
                      <div className="d-flex align-items-center gap-1"><Clock size={14} /> {formatTimestamp(selectedPost.createdAt)}</div>
                    </div>
                  </div>
                  {selectedPost.author?.id === user?.id && (
                    <button className="btn btn-outline-danger btn-sm rounded-circle p-2" onClick={deleteSelectedPost} disabled={deleting} title="Delete post">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="forum-content fs-5 mb-5 p-4 bg-light rounded-4 text-dark shadow-sm">
                  {selectedPost.content}
                </div>

                <div className="border-top pt-5">
                  <h3 className="h5 mb-4 d-flex align-items-center gap-2">
                    <MessageSquare size={18} className="text-primary" /> Replies ({comments.length})
                  </h3>
                  
                  <div className="vstack gap-4 mb-5">
                    {comments.map((comment) => (
                      <div className="d-flex gap-3" key={comment.id}>
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.fullName)}&background=random&size=40`}
                          alt="avatar"
                          className="rounded-circle align-self-start"
                        />
                        <div className="flex-grow-1 p-3 rounded-4 bg-light bg-opacity-50">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-bold small">{comment.author?.fullName}</span>
                            <span className="text-muted smaller">{formatTimestamp(comment.createdAt)}</span>
                          </div>
                          <div className="text-dark small">{comment.content}</div>
                        </div>
                      </div>
                    ))}
                    {comments.length === 0 && <div className="text-center py-4 text-muted small">Be the first to reply!</div>}
                  </div>

                  <form className="mt-4" onSubmit={addComment}>
                    <div className="surface p-3 bg-light border-0 shadow-sm">
                      <textarea 
                        className="form-control bg-transparent border-0 mb-2 p-0 px-2" 
                        rows="2" 
                        placeholder="Write your reply..." 
                        value={commentForm.content} 
                        onChange={(e) => setCommentForm({ content: e.target.value })} 
                        required 
                      />
                      <div className="d-flex justify-content-end">
                        <button className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-primary">
                          <Send size={16} /> Reply
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            ) : (
              <div className="surface p-5 d-flex flex-column align-items-center justify-content-center h-100 text-center opacity-75">
                <MessageSquare size={64} className="text-muted mb-4 opacity-10" />
                <h3 className="h5 text-muted">Select a discussion</h3>
                <p className="text-muted small">Choose a topic from the sidebar to read and participate.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}
