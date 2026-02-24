import { useState } from 'react';
import { BookOpen, Eye, RefreshCw, Lightbulb, Shield, Beaker } from 'lucide-react';

export default function BenefitsSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const benefits = [
    {
      icon: BookOpen,
      title: "Better Understanding",
      description: "Clear 3D visuals help students grasp complex concepts easily.",
      color: "#00d4ff",
      benefit: "Visual clarity"
    },
    {
      icon: Eye,
      title: "Repeated Practice",
      description: "Unlimited attempts to master experiments without constraints.",
      color: "#00ff88",
      benefit: "Mastery through repetition"
    },
    {
      icon: RefreshCw,
      title: "Safe Learning",
      description: "No accidents or safety risks during practice sessions.",
      color: "#7289da",
      benefit: "Risk-free environment"
    },
    {
      icon: Lightbulb,
      title: "Confidence",
      description: "Build exam readiness through thorough preparation.",
      color: "#ffa500",
      benefit: "Exam preparedness"
    },
    {
      icon: Shield,
      title: "Online Support",
      description: "Structured learning with guided experiments and feedback.",
      color: "#00d4ff",
      benefit: "Guided learning"
    },
    {
      icon: Beaker,
      title: "Offline Future",
      description: "Remote access ensures learning continues anywhere.",
      color: "#00ff88",
      benefit: "Anywhere learning"
    }
  ];

  return (
    <section id="benefits" className="relative w-full min-h-screen py-16 md:py-24 lg:py-32 overflow-hidden bg-black">
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
              Benefits of Using the SHIKARA LAB
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Improves understanding, practice, and accessibility
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isActive = activeCard === index;

            return (
              <div
                key={index}
                className="group relative h-full"
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Card */}
                <div
                  className="relative p-6 md:p-7 lg:p-8 rounded-2xl h-full transition-all duration-300 ease-out overflow-hidden backdrop-blur-md"
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
                      background: `linear-gradient(90deg, transparent, ${benefit.color}80, transparent)`,
                      opacity: isActive ? 1 : 0
                    }}
                  />

                  {/* Icon and Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="p-3 md:p-3.5 rounded-xl transition-all duration-300"
                      style={{
                        background: isActive ? `rgba(0, 212, 255, 0.12)` : `rgba(255, 255, 255, 0.04)`,
                        border: `1.5px solid ${benefit.color}25`,
                        boxShadow: isActive
                          ? `0 0 16px ${benefit.color}30, inset 0 0 8px ${benefit.color}15`
                          : `0 0 8px ${benefit.color}15`
                      }}
                    >
                      <Icon size={24} style={{ color: benefit.color }} strokeWidth={1.5} />
                    </div>

                    <div
                      className="text-xs md:text-sm font-black rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center transition-all duration-300"
                      style={{
                        background: `${benefit.color}15`,
                        color: benefit.color,
                        border: `1px solid ${benefit.color}35`
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3
                      className="text-lg md:text-xl font-bold mb-2 md:mb-3 transition-colors duration-300"
                      style={{ color: benefit.color }}
                    >
                      {benefit.title}
                    </h3>

                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4 md:mb-5 font-medium">
                      {benefit.description}
                    </p>

                    {/* Benefit Tag */}
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300"
                      style={{
                        background: `${benefit.color}12`,
                        color: benefit.color,
                        border: `0.5px solid ${benefit.color}35`,
                        opacity: isActive ? 1 : 0.7
                      }}
                    >
                      <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full" style={{ background: benefit.color }} />
                      {benefit.benefit}
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${benefit.color}80, transparent)`,
                      opacity: isActive ? 1 : 0
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
