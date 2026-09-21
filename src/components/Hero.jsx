import { motion } from 'framer-motion'
import ParallaxScene from './parallax/ParallaxScene'
import DialogPanel from './ui/DialogPanel'
import { scenes } from '../assets/backgrounds'

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
      className="relative isolate min-h-screen flex items-center overflow-hidden"
    >
      <ParallaxScene layers={scenes.hero} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <DialogPanel className="max-w-3xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={itemVariants}
              className="text-accent font-sans text-sm mb-4 tracking-widest uppercase"
            >
              Available for hire
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="font-display text-3xl md:text-5xl text-text-primary leading-tight mb-6"
            >
              Hi, I'm{' '}
              <span className="text-accent">Erik Hostnik</span>
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
                className="px-6 py-3 bg-accent text-bg font-semibold pixel-border pixel-border-active transition-colors duration-200 hover:bg-accent-secondary"
              >
                View Projects
              </a>
              <a
                href="/resume.pdf"
                download
                className="px-6 py-3 bg-surface text-text-primary font-semibold pixel-border pixel-border-active hover:text-accent transition-colors duration-200"
              >
                Download CV
              </a>
            </motion.div>
          </motion.div>
        </DialogPanel>
      </div>
    </section>
  )
}
