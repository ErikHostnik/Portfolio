import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.p
            variants={fadeInUp}
            className="text-accent font-mono text-sm tracking-widest uppercase mb-3"
          >
            Work
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-text-primary mb-12"
          >
            Projects
          </motion.h2>

          {/* Bento grid */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                className={project.featured ? 'md:col-span-2' : ''}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
