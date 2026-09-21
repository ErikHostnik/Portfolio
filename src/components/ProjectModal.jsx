import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiGithub, FiExternalLink } from 'react-icons/fi'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 28, stiffness: 380 } },
  exit: { opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.18 } },
}

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const hasSubProjects = project.subProjects && project.subProjects.length > 0

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-bg/85"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-surface pixel-border"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="h-1 w-full bg-accent" />

        <div className="p-6 md:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-text-muted hover:text-accent hover:bg-bg transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Category badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-sans text-accent bg-bg px-2.5 py-1 border border-border mb-4">
            {project.category}
          </span>

          {/* Title */}
          <h2
            id="modal-title"
            className="font-display text-xl md:text-2xl text-text-primary mb-3"
          >
            {project.title}
          </h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-sans text-accent-secondary bg-bg px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Long description */}
          <p className="text-text-muted leading-relaxed mb-6">
            {project.longDescription || project.description}
          </p>

          {/* Links */}
          {(project.github || project.demo) && (
            <div className="flex items-center gap-4 pb-6 border-b border-border/40">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
                >
                  <FiGithub className="w-4 h-4" />
                  View on GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
                >
                  <FiExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          )}

          {/* Sub-projects */}
          {hasSubProjects && (
            <div className="mt-6">
              <h3 className="text-xs font-sans text-text-muted uppercase tracking-widest mb-4">
                {project.subProjects.length} sub-project{project.subProjects.length !== 1 ? 's' : ''}
              </h3>
              <div className="space-y-3">
                {project.subProjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="group relative bg-bg border border-border/40 p-4 hover:border-accent transition-colors duration-200"
                  >
                    <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-accent/40 group-hover:bg-accent-secondary transition-colors" />

                    <div className="pl-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-sm font-semibold text-text-primary">
                          {sub.title}
                        </h4>
                        {sub.github && (
                          <a
                            href={sub.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-muted hover:text-accent transition-colors flex-shrink-0"
                            aria-label={`${sub.title} on GitHub`}
                          >
                            <FiGithub className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed mb-2.5">
                        {sub.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-sans text-accent bg-bg px-1.5 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-1 w-full bg-accent/40" />
      </motion.div>
    </motion.div>
  )
}
