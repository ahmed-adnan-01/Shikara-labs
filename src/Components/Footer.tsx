import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Need', href: '#need' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-black select-none mt-0 border-t-2" style={{
      borderColor: 'rgba(0, 212, 255, 0.5)',
      boxShadow: '0 -10px 40px rgba(0, 212, 255, 0.3)'
    }}>
      {/* Top Separator Line - Very Visible */}
      <div className="w-full h-[3px]" style={{
        background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 1), transparent)',
        boxShadow: '0 0 60px rgba(0, 212, 255, 1)'
      }}></div>

      {/* Glow effect on top line - Enhanced */}
      <div className="w-full h-20 bg-gradient-to-b from-cyan-500/20 via-cyan-500/10 to-transparent pointer-events-none"></div>

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 select-none" style={{
              background: 'linear-gradient(90deg, #00d4ff 0%, #00ff88 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              SHIKARA LAB
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6">
              Virtual laboratories supporting comprehensive learning and practice for students. Enhancing education through safe, accessible, and unlimited experimentation.
            </p>
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="p-1.5 sm:p-2 rounded-lg transition-all duration-400"
                    style={{
                      background: 'rgba(0, 212, 255, 0.1)',
                      border: '1px solid rgba(0, 212, 255, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.4)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 212, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Icon size={16} className="sm:w-[18px] sm:h-[18px] text-cyan-400" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg sm:text-xl font-black mb-4 sm:mb-6 select-none" style={{
              background: 'linear-gradient(90deg, #00d4ff 0%, #00ff88 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-xs sm:text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-cyan-400 group-hover:w-3 sm:group-hover:w-4 transition-all duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg sm:text-xl font-black mb-4 sm:mb-6 select-none" style={{
              background: 'linear-gradient(90deg, #00d4ff 0%, #00ff88 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Contact Info
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <Mail size={16} className="sm:w-[18px] sm:h-[18px] text-cyan-400 mt-1 flex-shrink-0" />
                <a href="mailto:support@shikara.lab" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-xs sm:text-sm break-all">
                  support@shikara.lab
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Phone size={16} className="sm:w-[18px] sm:h-[18px] text-cyan-400 mt-1 flex-shrink-0" />
                <a href="tel:+918899008194" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-xs sm:text-sm">
                  +91 8899008194
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-cyan-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-xs sm:text-sm">
                  Srinagar, Jammu and Kashmir
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg sm:text-xl font-black mb-4 sm:mb-6 select-none" style={{
              background: 'linear-gradient(90deg, #00d4ff 0%, #00ff88 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Stay Updated
            </h4>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              Subscribe to our newsletter for updates and educational resources.
            </p>
            <div className="flex flex-col gap-2.5 sm:gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-medium transition-all duration-400 focus:outline-none"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.2)';
                  e.currentTarget.style.background = 'rgba(0, 212, 255, 0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                }}
              />
              <button
                className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-400"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
                  color: '#000000',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px mb-6 sm:mb-8" style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent)'
        }}></div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6"
        >
          <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left select-none">
            © {new Date().getFullYear()} SHIKARA LAB. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 text-xs sm:text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 text-xs sm:text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 text-xs sm:text-sm">
              Cookie Policy
            </a>
          </div>
        </motion.div>

        {/* Made with love */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center mt-6 sm:mt-8"
        >
          <p className="text-gray-600 text-xs select-none">
            Made with <span className="text-red-500 animate-pulse">❤</span> for students everywhere
          </p>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-2.5 sm:p-3 rounded-full transition-all duration-400 z-50"
        style={{
          background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.3)';
        }}
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} className="sm:w-5 sm:h-5 text-black" />
      </button>

      <style>{`
        input::placeholder {
          color: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </footer>
  );
}
