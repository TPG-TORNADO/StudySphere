export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-3 text-primary py-5 my-5">
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status"></div>
      <span className="fw-bold text-uppercase small">{label}</span>
    </div>
  )
}
