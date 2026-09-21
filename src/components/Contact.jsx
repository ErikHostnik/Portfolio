// src/components/Contact.jsx
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { FiGithub, FiLinkedin, FiMail, FiSend } from 'react-icons/fi'
import ParallaxScene from './parallax/ParallaxScene'
import DialogPanel from './ui/DialogPanel'
import { scenes } from '../assets/backgrounds'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/yourusername',
    icon: FiGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/yourusername',
    icon: FiLinkedin,
  },
  {
    label: 'Email',
    href: 'mailto:your@email.com',
    icon: FiMail,
  },
]

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle')

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('sending')

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      )
      .then(() => {
        setStatus('sent')
        formRef.current.reset()
      })
      .catch(() => {
        setStatus('error')
      })
  }

  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden">
      <ParallaxScene layers={scenes.contact} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <DialogPanel>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.p
              variants={fadeInUp}
              className="text-accent font-sans text-sm tracking-widest uppercase mb-3"
            >
              Contact
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-2xl md:text-3xl text-text-primary mb-4"
            >
              Get In Touch
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-text-muted max-w-lg mb-12"
            >
              I'm open to new opportunities, collaborations, or just a good
              conversation. Drop me a message and I'll get back to you.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Form */}
              <motion.form
                ref={formRef}
                onSubmit={handleSubmit}
                variants={fadeInUp}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="contact-name" className="sr-only">Your name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    className="w-full bg-bg border-2 border-border px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">Your email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="Your email"
                    required
                    className="w-full bg-bg border-2 border-border px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">Your message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Your message"
                    required
                    rows={5}
                    className="w-full bg-bg border-2 border-border px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending' || status === 'sent'}
                  className="flex items-center gap-2 px-6 py-3 bg-accent text-bg font-semibold pixel-border pixel-border-active hover:bg-accent-secondary disabled:opacity-60 transition-colors duration-200 text-sm"
                >
                  <FiSend className="w-4 h-4" />
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'sent' && (
                  <p className="text-sm text-accent-secondary">Message sent successfully!</p>
                )}
                {status === 'error' && (
                  <p className="text-sm text-red-400">
                    Something went wrong. Please try again or email directly.
                  </p>
                )}
              </motion.form>

              {/* Social links */}
              <motion.div variants={fadeInUp} className="space-y-6">
                <p className="text-text-muted text-sm">Or reach me directly:</p>
                <div className="space-y-4">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors group"
                    >
                      <span className="w-10 h-10 flex items-center justify-center border-2 border-border bg-bg group-hover:border-accent transition-colors">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-sm font-medium">{label}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer tagline */}
            <motion.div
              variants={fadeInUp}
              className="mt-24 pt-8 border-t border-border/40 text-center"
            >
              <p className="text-text-muted text-sm">
                Designed & built by{' '}
                <span className="text-accent font-semibold">Your Name</span>
                {' '}· {new Date().getFullYear()}
              </p>
            </motion.div>
          </motion.div>
        </DialogPanel>
      </div>
    </section>
  )
}
