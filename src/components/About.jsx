import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {/* Text */}
          <div>
            <motion.p
              variants={fadeInUp}
              className="text-accent font-mono text-sm tracking-widest uppercase mb-3"
            >
              About Me
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-text-primary mb-8"
            >
              About Me
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              data-testid="about-bio"
              className="space-y-4 text-text-muted leading-relaxed"
            >
              <p>
                I'm a full-stack developer with a passion for building products that are
                as thoughtful under the hood as they are on the surface. I care about
                clean architecture, performance, and the small details that make
                interfaces feel great.
              </p>
              <p>
                Whether I'm designing a database schema, building a React component, or
                deploying to production — I bring the same level of attention and
                craft to every layer.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new technologies, contributing
                to open source, or picking apart how great products are built.
              </p>
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            variants={fadeInUp}
            className="flex justify-center md:justify-end"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Gradient backdrop */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-secondary/20 blur-2xl" />
              {/* Photo placeholder */}
              <div className="relative w-full h-full rounded-2xl border border-border bg-surface flex items-center justify-center overflow-hidden">
                <span className="text-6xl font-bold gradient-text">EH</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
