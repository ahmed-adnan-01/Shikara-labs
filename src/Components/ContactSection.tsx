import { useState } from 'react';
import { Mail, Phone, MapPin, Send, User, MessageSquare } from 'lucide-react';
import { saveSubmission } from '../services/contactService';

export default function ContactSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      // Save to localStorage for admin panel
      saveSubmission({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });

      // Also send to Formspree (email)
      const response = await fetch('https://formspree.io/f/xojnqdyz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSubmitStatus(''), 5000);
      } else {
        // Even if Formspree fails, we saved to localStorage
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSubmitStatus(''), 5000);
      }
    } catch (error) {
      // Even if error, we saved to localStorage
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "support@shikara.lab",
      color: "#00d4ff",
      link: "mailto:support@shikara.lab"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "+91 8899008194",
      color: "#00ff88",
      link: "tel:+918899008194"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Srinagar, Jammu and Kashmir",
      color: "#7289da",
      link: "#"
    }
  ];

  return (
    <section id="contact" className="relative w-full min-h-screen py-16 md:py-24 lg:py-32 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
        
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }}
        />
        
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full filter blur-3xl opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-16">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
              Share Your Feedback
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Side - Contact Info Cards */}
          <div className="space-y-4 sm:space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const isActive = activeCard === index;
              
              return (
                <a
                  key={index}
                  href={info.link}
                  className="group relative block"
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div
                    className="relative p-6 md:p-7 rounded-2xl transition-all duration-300 ease-out overflow-hidden backdrop-blur-md"
                    style={{
                      background: isActive
                        ? 'rgba(0, 212, 255, 0.08)'
                        : 'rgba(255, 255, 255, 0.02)',
                      border: isActive
                        ? `1.5px solid rgba(0, 212, 255, 0.4)`
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isActive
                        ? '0 8px 32px rgba(0, 212, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                      transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                    }}
                  >
                    {/* Top accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${info.color}80, transparent)`,
                        opacity: isActive ? 1 : 0
                      }}
                    />

                    {/* Icon and Content */}
                    <div className="flex items-center gap-4 md:gap-5">
                      <div
                        className="p-3 md:p-3.5 rounded-xl transition-all duration-300"
                        style={{
                          background: isActive ? `rgba(0, 212, 255, 0.12)` : `rgba(255, 255, 255, 0.04)`,
                          border: `1.5px solid ${info.color}25`,
                          boxShadow: isActive
                            ? `0 0 16px ${info.color}30, inset 0 0 8px ${info.color}15`
                            : `0 0 8px ${info.color}15`
                        }}
                      >
                        <Icon size={24} style={{ color: info.color }} strokeWidth={1.5} />
                      </div>

                      <div className="flex-grow">
                        <h3
                          className="text-lg md:text-xl font-bold mb-1 md:mb-2 transition-colors duration-300"
                          style={{ color: info.color }}
                        >
                          {info.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-medium">
                          {info.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${info.color}80, transparent)`,
                        opacity: isActive ? 1 : 0
                      }}
                    />
                  </div>
                </a>
              );
            })}
          </div>

          {/* Right Side - Contact Form */}
          <div>
            <div
              className="relative p-6 md:p-7 lg:p-8 rounded-2xl transition-all duration-300 ease-out overflow-hidden backdrop-blur-md"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.8), transparent)',
                }}
              />

              <h3 className="text-xl md:text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                  Send Your Feedback
                </span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-gray-300">
                    Your Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: '#00d4ff' }} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="ahmed adnan"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: '#00ff88' }} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="ahmed@example.com"
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: '#7289da' }} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="+91 1234 567 890"
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-gray-300">
                    Your Message
                  </label>
                  <div className="relative">
                    <MessageSquare size={18} className="absolute left-4 top-4" style={{ color: '#ffa500' }} />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full pl-12 pr-4 py-3 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="Share your experience, suggestions, or ideas..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 md:py-4 rounded-lg font-black text-base text-black transition-all duration-300 cursor-pointer uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)',
                    boxShadow: '0 10px 40px rgba(0, 212, 255, 0.8)',
                    letterSpacing: '0.5px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 15px 60px rgba(0, 255, 136, 1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 212, 255, 0.8)';
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Submit Feedback
                      <Send size={18} />
                    </span>
                  )}
                </button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div
                    className="text-center p-3 rounded-lg"
                    style={{
                      background: 'rgba(0, 255, 136, 0.12)',
                      border: '1px solid rgba(0, 255, 136, 0.35)',
                    }}
                  >
                    <p className="text-emerald-300 font-bold text-sm">
                      ✓ Thank you for your feedback! We appreciate your input.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div
                    className="text-center p-3 rounded-lg"
                    style={{
                      background: 'rgba(255, 107, 107, 0.12)',
                      border: '1px solid rgba(255, 107, 107, 0.3)',
                    }}
                  >
                    <p className="text-red-300 font-bold text-sm">
                      Something went wrong. Please try again.
                    </p>
                  </div>
                )}
              </form>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.8), transparent)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
