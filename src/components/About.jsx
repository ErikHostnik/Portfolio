// src/components/About.jsx
import { motion } from 'framer-motion'
import ParallaxScene from './parallax/ParallaxScene'
import DialogPanel from './ui/DialogPanel'
import { scenes } from '../assets/backgrounds'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function About() {
  return (
    <section id="about" className="relative isolate py-24 md:py-32 overflow-hidden">
      <ParallaxScene layers={scenes.about} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <DialogPanel>
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
                className="text-accent font-sans text-sm tracking-widest uppercase mb-3"
              >
                Who I Am
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="font-display text-2xl md:text-3xl text-text-primary mb-8"
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
                <div className="relative w-full h-full pixel-border bg-surface flex items-center justify-center overflow-hidden">
                  <span className="text-6xl font-display text-accent">EH</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </DialogPanel>
      </div>
    </section>
  )
}
