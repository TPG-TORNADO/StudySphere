export default function AlertMessage({ type = 'danger', children }) {
  if (!children) {
    return null
  }

  return (
    <div className={`alert alert-${type} d-flex align-items-center gap-3 border-0 shadow-sm rounded-4 px-4 py-3 mb-4`}>
      {children}
    </div>
  )
}

