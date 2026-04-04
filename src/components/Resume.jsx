import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'
import { resume } from '../data/resume'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

function TimelineItem({ role, company, period, description }) {
  return (
    <div className="relative pl-6 border-l border-border pb-10 last:pb-0">
      {/* Dot */}
      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-accent" />
      <p className="text-xs font-mono text-text-muted mb-1">{period}</p>
      <h4 className="text-base font-semibold text-text-primary">{role}</h4>
      <p className="text-sm text-accent mb-2">{company}</p>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  )
}

export default function Resume() {
  return (
    <section id="resume" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {/* Header row */}
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <motion.p
                variants={fadeInUp}
                className="text-accent font-mono text-sm tracking-widest uppercase mb-3"
              >
                CV
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold text-text-primary"
              >
                Resume
              </motion.h2>
            </div>
            <motion.a
              variants={fadeInUp}
              href="/resume.pdf"
              download
              className="flex items-center gap-2 px-5 py-2.5 border border-border text-text-primary rounded-lg hover:border-accent hover:text-accent transition-colors duration-200 text-sm font-medium"
            >
              <FiDownload className="w-4 h-4" />
              Download PDF
            </motion.a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Experience */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-8">
                Experience
              </h3>
              <div>
                {resume.experience.map((item) => (
                  <TimelineItem key={item.id} {...item} />
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-8">
                Education
              </h3>
              <div>
                {resume.education.map((item) => (
                  <TimelineItem
                    key={item.id}
                    role={item.degree}
                    company={item.institution}
                    period={item.period}
                    description={item.description}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
