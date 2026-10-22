import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { PublicNavbar } from './PublicNavbar';
import { ShieldCheck, Target, Rocket, Award, ArrowRight } from 'lucide-react';
import { AuthUser } from '../../types';

interface AboutPageProps {
  onNavigate: (page: string) => void;
  currentUser?: AuthUser;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  currentUser,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (pillarsRef.current) {
        gsap.fromTo(
          pillarsRef.current.children,
          { opacity: 0, y: 25, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out',
          }
        );
      }
    },
    { scope: containerRef }
  );

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    gsap.to(e.currentTarget, {
      y: enter ? -4 : 0,
      scale: enter ? 1.015 : 1,
      borderColor: enter ? '#D3E0FD' : '#EFF0F6',
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F8F9FD] flex flex-col font-sans antialiased text-[#151E23]"
    >
      <PublicNavbar
        currentPage="about"
        onNavigate={onNavigate}
        currentUser={currentUser}
      />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-[#E51837] uppercase tracking-wider">
              About Tesla Performance &amp; Learning
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#151E23] tracking-tight">
              Engineering Excellence through Constant Competency Growth
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              At Tesla, our mission is to accelerate the world&apos;s transition to sustainable energy.
              Achieving this demands unprecedented standards of safety, quality, and velocity across our
              global manufacturing facilities, design studios, and regional teams.
            </p>
          </div>

          {/* Core Pillars with GSAP Entrance */}
          <div ref={pillarsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              className="p-6 bg-white rounded-2xl border border-[#EFF0F6] shadow-2xs space-y-3 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E51837] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#151E23]">
                Zero Compromise on Safety
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                From battery cell manufacturing to high-voltage electronics, every procedure is verified
                with interactive micro-assessments ensuring every team member is aligned on safety protocols.
              </p>
            </div>

            <div
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              className="p-6 bg-white rounded-2xl border border-[#EFF0F6] shadow-2xs space-y-3 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1B59F8] flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#151E23]">
                Data-Driven Retention Metrics
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Rather than annual multi-hour slide decks, we measure knowledge retention daily in short
                2-minute intervals, providing instant visibility into weakest and strongest operational topics.
              </p>
            </div>

            <div
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              className="p-6 bg-white rounded-2xl border border-[#EFF0F6] shadow-2xs space-y-3 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#151E23]">
                Localhost Data Privacy
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                All records, quiz scores, employee rosters, and configuration parameters are stored locally
                and directly managed on your device, ensuring maximum responsiveness and zero external telemetry.
              </p>
            </div>

            <div
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              className="p-6 bg-white rounded-2xl border border-[#EFF0F6] shadow-2xs space-y-3 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#151E23]">
                Healthy Competitive Culture
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Facilities in Houston, Fremont, Berlin, and Shanghai benchmark their knowledge gain collaboratively,
                celebrating top performers and accelerating onboarding for new cohorts.
              </p>
            </div>
          </div>

          {/* Numbers / Benchmarks */}
          <div className="p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-[#EFF0F6] shadow-sm">
            <h2 className="text-xl font-bold text-center text-[#151E23] mb-8">
              Workforce Training at a Glance
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#1B59F8]">
                  98.4%
                </span>
                <span className="text-xs text-gray-500 block mt-1">
                  Compliance Rate
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#10B981]">
                  2m 34s
                </span>
                <span className="text-xs text-gray-500 block mt-1">
                  Target Session Length
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#E51837]">
                  +34%
                </span>
                <span className="text-xs text-gray-500 block mt-1">
                  Avg. Knowledge Lift
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#151E23]">
                  100%
                </span>
                <span className="text-xs text-gray-500 block mt-1">
                  Localhost Offline Ready
                </span>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="text-center space-y-4 pt-4">
            <h3 className="text-xl font-bold text-[#151E23]">
              Ready to explore current metrics and modules?
            </h3>
            <button
              onClick={() => onNavigate('reports')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1B59F8] hover:bg-[#1546C4] text-white text-sm font-semibold transition-all cursor-pointer shadow-md"
            >
              <span>Go to Reports Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-[#EFF0F6] py-6 text-xs text-center text-gray-500">
        Tesla Learning System · All data persistently managed on Localhost
      </footer>
    </div>
  );
};
