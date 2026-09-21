import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGlobe, FiCpu, FiDatabase, FiCode, FiZap, FiChevronRight } from 'react-icons/fi'
import { projects } from '../data/projects'
import ProjectModal from './ProjectModal'
import ParallaxScene from './parallax/ParallaxScene'
import DialogPanel from './ui/DialogPanel'
import { scenes } from '../assets/backgrounds'

const CATEGORY_ICONS = {
  'Full Stack': FiGlobe,
  Embedded: FiCpu,
  Backend: FiDatabase,
  Frontend: FiCode,
}

function getIcon(category) {
  return CATEGORY_ICONS[category] ?? FiZap
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

function TreeNode({ project, index, onOpen }) {
  const isRight = index % 2 === 0
  const Icon = getIcon(project.category)
  const hasSubProjects = project.subProjects && project.subProjects.length > 0

  return (
    <motion.div
      className="relative flex items-center w-full"
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {/* ── Left slot ── */}
      <div className="flex-1 flex justify-end pr-6 md:pr-10">
        {!isRight ? (
          <TreeCard project={project} onOpen={onOpen} side="left" hasSubProjects={hasSubProjects} Icon={Icon} />
        ) : (
          <div className="w-full" />
        )}
      </div>

      {/* ── Central node ── */}
      <div className="flex-shrink-0 w-10 h-10 bg-surface border-2 border-accent flex items-center justify-center z-10">
        <Icon className="w-4 h-4 text-accent" />
      </div>

      {/* ── Right slot ── */}
      <div className="flex-1 flex justify-start pl-6 md:pl-10">
        {isRight ? (
          <TreeCard project={project} onOpen={onOpen} side="right" hasSubProjects={hasSubProjects} Icon={Icon} />
        ) : (
          <div className="w-full" />
        )}
      </div>
    </motion.div>
  )
}

function TreeCard({ project, onOpen, side, hasSubProjects }) {
  const isLeft = side === 'left'

  return (
    <motion.button
      onClick={() => onOpen(project)}
      className="group relative w-full max-w-sm text-left bg-surface pixel-border pixel-border-active p-5 cursor-pointer hover:border-accent transition-colors duration-300"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      aria-label={`Open ${project.title} details`}
    >
      {/* Connector line to central path */}
      <span
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 h-0.5 w-6 md:w-10 bg-accent/60 ${isLeft ? '-right-6 md:-right-10' : '-left-6 md:-left-10'}`}
      />

      {/* Category badge */}
      <span className="inline-flex items-center gap-1 text-[10px] font-sans text-accent bg-bg px-2 py-0.5 border border-border mb-3">
        {project.category}
      </span>

      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <FiChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200" />
      </div>

      {/* Description */}
      <p className="text-xs text-text-muted leading-relaxed mb-3 line-clamp-2">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-sans text-accent-secondary bg-bg px-1.5 py-0.5"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 4 && (
          <span className="text-[10px] font-sans text-text-muted px-1.5 py-0.5">
            +{project.tags.length - 4}
          </span>
        )}
      </div>

      {/* Sub-project indicator */}
      {hasSubProjects && (
        <div className="flex items-center gap-1.5 pt-2.5 border-t border-border/40">
          <div className="flex gap-0.5">
            {project.subProjects.slice(0, 4).map((_, i) => (
              <span
                key={i}
                className="w-1 h-3 bg-accent/50 group-hover:bg-accent-secondary transition-colors"
                style={{ transitionDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
          <span className="text-[10px] font-sans text-text-muted">
            {project.subProjects.length} sub-project{project.subProjects.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </motion.button>
  )
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section id="projects" className="relative isolate py-24 md:py-32 overflow-hidden">
      <ParallaxScene layers={scenes.projects} />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <DialogPanel>
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="mb-20"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-accent font-sans text-xs tracking-widest uppercase mb-3"
            >
              Work
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-2xl md:text-3xl text-text-primary"
            >
              Projects
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-text-muted mt-4 max-w-md"
            >
              Click any project to explore details, links, and sub-projects.
            </motion.p>
          </motion.div>

          {/* Tree */}
          <div className="relative">
            {/* Start node */}
            <motion.div
              className="flex justify-center mb-10"
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-10 h-10 bg-accent flex items-center justify-center z-10">
                <FiZap className="w-4 h-4 text-bg" />
              </div>
            </motion.div>

            {/* Vertical path line */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 bg-accent/40"
              style={{ height: '100%' }}
            />

            {/* Project nodes */}
            <div className="space-y-14">
              {projects.map((project, index) => (
                <TreeNode
                  key={project.id}
                  project={project}
                  index={index}
                  onOpen={setSelectedProject}
                />
              ))}
            </div>

            {/* End node */}
            <motion.div
              className="flex justify-center mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="w-3 h-3 bg-accent/40 border border-accent/60" />
            </motion.div>
          </div>
        </DialogPanel>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
