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
  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Prevent body scroll
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
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#111111] border border-[#27272a] rounded-2xl shadow-2xl"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header gradient line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#6366f1] to-transparent" />

        <div className="p-6 md:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#71717a] hover:text-[#f4f4f5] hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Category badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#6366f1] bg-[#6366f1]/10 px-2.5 py-1 rounded-md border border-[#6366f1]/20 mb-4">
            {project.category}
          </span>

          {/* Title */}
          <h2
            id="modal-title"
            className="text-2xl md:text-3xl font-bold text-[#f4f4f5] mb-3"
          >
            {project.title}
          </h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono text-[#a855f7] bg-[#a855f7]/10 px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Long description */}
          <p className="text-[#a1a1aa] leading-relaxed mb-6">
            {project.longDescription || project.description}
          </p>

          {/* Links */}
          {(project.github || project.demo) && (
            <div className="flex items-center gap-4 pb-6 border-b border-[#27272a]">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#71717a] hover:text-[#f4f4f5] transition-colors"
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
                  className="flex items-center gap-2 text-sm text-[#71717a] hover:text-[#6366f1] transition-colors"
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
              <h3 className="text-xs font-mono text-[#71717a] uppercase tracking-widest mb-4">
                {project.subProjects.length} sub-project{project.subProjects.length !== 1 ? 's' : ''}
              </h3>
              <div className="space-y-3">
                {project.subProjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="group relative bg-[#0a0a0a] border border-[#27272a] rounded-xl p-4 hover:border-[#6366f1]/50 transition-colors duration-200"
                  >
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-[#6366f1]/40 group-hover:bg-[#6366f1] transition-colors" />

                    <div className="pl-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-sm font-semibold text-[#f4f4f5]">
                          {sub.title}
                        </h4>
                        {sub.github && (
                          <a
                            href={sub.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#71717a] hover:text-[#f4f4f5] transition-colors flex-shrink-0"
                            aria-label={`${sub.title} on GitHub`}
                          >
                            <FiGithub className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-[#71717a] leading-relaxed mb-2.5">
                        {sub.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono text-[#6366f1] bg-[#6366f1]/10 px-1.5 py-0.5 rounded"
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

        {/* Footer gradient line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#6366f1]/40 to-transparent" />
      </motion.div>
    </motion.div>
  )
}
