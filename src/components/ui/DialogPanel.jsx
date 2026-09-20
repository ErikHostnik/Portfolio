export default function DialogPanel({ children, className = '' }) {
  return (
    <div className={`relative bg-surface/90 pixel-border rounded-none px-6 py-8 md:px-10 md:py-12 ${className}`}>
      {children}
    </div>
  )
}
