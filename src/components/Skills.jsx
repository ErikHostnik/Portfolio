import { motion } from 'framer-motion'
import { skills } from '../data/skills'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const pillVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-accent font-mono text-sm tracking-widest uppercase mb-3"
          >
            Stack
          </motion.p>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-4xl md:text-5xl font-bold text-text-primary mb-12"
          >
            Skills
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
                  {category}
                </h3>
                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {items.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={pillVariants}
                      className="text-sm font-mono text-text-primary bg-surface border border-border px-3 py-1.5 rounded-lg hover:border-accent hover:text-accent transition-colors duration-200 cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
