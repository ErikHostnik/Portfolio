import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-accent font-mono text-sm mb-4 tracking-widest uppercase"
          >
            Available for hire
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-text-primary leading-tight mb-6"
          >
            Hi, I'm{' '}
            <span className="gradient-text">Erik Hostnik</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-text-muted max-w-2xl mb-4 leading-relaxed"
          >
            Full-stack developer building clean, performant, and thoughtful
            digital products.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-base text-text-muted max-w-xl mb-10"
          >
            I care about the details — from system architecture down to pixel-perfect
            interfaces. Let's build something great.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200"
            >
              View Projects
            </a>
            <a
              href="/resume.pdf"
              download
              className="px-6 py-3 border border-border text-text-primary font-medium rounded-lg hover:border-accent hover:text-accent transition-colors duration-200"
            >
              Download CV
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
