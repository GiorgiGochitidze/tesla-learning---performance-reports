import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { PublicNavbar } from './PublicNavbar';
import {
  ArrowRight,
  TrendingUp,
  Zap,
  CheckCircle,
  BarChart3,
  Users,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AuthUser } from '../../types';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  currentUser?: AuthUser;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  currentUser,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Counter refs for numbers
  const count1Ref = useRef<HTMLSpanElement>(null);
  const count2Ref = useRef<HTMLSpanElement>(null);
  const count3Ref = useRef<HTMLSpanElement>(null);
  const count4Ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      // 1. Ambient pulsing background glow
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.25,
          opacity: 0.8,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // 2. Master Hero Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 40, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 },
          '-=0.4'
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          ctaRef.current?.children ? Array.from(ctaRef.current.children) : [],
          { opacity: 0, y: 20, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.6,
            ease: 'back.out(1.7)',
          },
          '-=0.4'
        )
        .fromTo(
          trustRef.current?.children ? Array.from(trustRef.current.children) : [],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          ribbonRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power2.out' },
          '-=0.3'
        );

      // 3. Staggered Number Count-up Animation
      const countObj = { val1: 0, val2: 0, val3: 0, val4: 0 };
      gsap.to(countObj, {
        val1: 86,
        val2: 34,
        val3: 3298,
        val4: 10,
        duration: 2,
        ease: 'power2.out',
        delay: 0.6,
        onUpdate: () => {
          if (count1Ref.current) count1Ref.current.innerText = `${Math.round(countObj.val1)}%`;
          if (count2Ref.current) count2Ref.current.innerText = `+${Math.round(countObj.val2)}%`;
          if (count3Ref.current) count3Ref.current.innerText = `${Math.round(countObj.val3).toLocaleString()}`;
          if (count4Ref.current) count4Ref.current.innerText = `${Math.round(countObj.val4)}`;
        },
      });

      // 4. Feature Cards Stagger entrance
      if (featuresRef.current) {
        gsap.fromTo(
          Array.from(featuresRef.current.children),
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            duration: 0.7,
            delay: 0.8,
            ease: 'power2.out',
          }
        );
      }
    },
    { scope: containerRef }
  );

  // GSAP interactive button hover helpers
  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>, enter: boolean) => {
    gsap.to(e.currentTarget, {
      y: enter ? -4 : 0,
      scale: enter ? 1.02 : 1,
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F8F9FD] flex flex-col font-sans antialiased text-[#151E23] overflow-x-hidden"
    >
      {/* Top Navbar */}
      <PublicNavbar
        currentPage="landing"
        onNavigate={onNavigate}
        currentUser={currentUser}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
          {/* Subtle GSAP pulsing background glow */}
          <div
            ref={glowRef}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[340px] bg-gradient-to-tr from-blue-400/15 via-purple-300/10 to-red-400/8 blur-3xl pointer-events-none rounded-full"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div
                ref={badgeRef}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EFF0F6] text-xs font-semibold text-gray-700 shadow-2xs cursor-default"
              >
                <span className="w-2 h-2 rounded-full bg-[#1FE08F] animate-pulse" />
                <span>Tesla Global Workforce Training Platform</span>
                <Sparkles className="w-3.5 h-3.5 text-[#1B59F8]" />
              </div>

              {/* Title */}
              <h1
                ref={titleRef}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#151E23] tracking-tight leading-[1.15]"
              >
                Precision Learning &amp; Real-time{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B59F8] via-[#0E2451] to-[#E51837]">
                  Performance Reports
                </span>
              </h1>

              {/* Subtitle */}
              <p
                ref={descRef}
                className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto"
              >
                Empowering Tesla manufacturing facilities, engineers, and leadership with
                data-driven microlearning, real-time knowledge gain tracking, and competitive team leaderboards.
              </p>

              {/* Action Buttons */}
              <div
                ref={ctaRef}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
              >
                <button
                  onClick={() => onNavigate('reports')}
                  onMouseEnter={(e) => handleButtonHover(e, true)}
                  onMouseLeave={(e) => handleButtonHover(e, false)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#1B59F8] text-white font-semibold text-sm shadow-md shadow-blue-500/20 cursor-pointer group"
                >
                  <span>Open Executive Reports</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('library')}
                  onMouseEnter={(e) => handleButtonHover(e, true)}
                  onMouseLeave={(e) => handleButtonHover(e, false)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-gray-800 border border-[#EFF0F6] font-semibold text-sm shadow-2xs cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-gray-500" />
                  <span>Browse Training Library</span>
                </button>
              </div>

              {/* Verified Trust points */}
              <div
                ref={trustRef}
                className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#1FE08F]" />
                  Localhost persistent storage
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#1FE08F]" />
                  Zero mock latency
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#1FE08F]" />
                  Live team leaderboards
                </span>
              </div>
            </div>

            {/* Interactive Metrics Ribbon with GSAP Count-up */}
            <div
              ref={ribbonRef}
              className="mt-14 max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#EFF0F6] shadow-xl shadow-gray-200/50"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="text-center pt-4 md:pt-0">
                  <span
                    ref={count1Ref}
                    className="text-3xl sm:text-4xl font-extrabold text-[#151E23] block"
                  >
                    0%
                  </span>
                  <span className="text-xs text-gray-500 font-medium mt-1 block">
                    Current Knowledge Score
                  </span>
                </div>

                <div className="text-center pt-4 md:pt-0">
                  <span
                    ref={count2Ref}
                    className="text-3xl sm:text-4xl font-extrabold text-[#10B981] block"
                  >
                    +0%
                  </span>
                  <span className="text-xs text-gray-500 font-medium mt-1 block">
                    Knowledge Gain Benchmark
                  </span>
                </div>

                <div className="text-center pt-4 md:pt-0">
                  <span
                    ref={count3Ref}
                    className="text-3xl sm:text-4xl font-extrabold text-[#151E23] block"
                  >
                    0
                  </span>
                  <span className="text-xs text-gray-500 font-medium mt-1 block">
                    Questions Completed
                  </span>
                </div>

                <div className="text-center pt-4 md:pt-0">
                  <span
                    ref={count4Ref}
                    className="text-3xl sm:text-4xl font-extrabold text-[#1B59F8] block"
                  >
                    0
                  </span>
                  <span className="text-xs text-gray-500 font-medium mt-1 block">
                    Active Regional Facilities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Section with GSAP Stagger */}
        <section className="py-16 bg-white border-t border-[#EFF0F6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold text-[#E51837] uppercase tracking-wider mb-2">
                Unified Ecosystem
              </h2>
              <p className="text-3xl font-bold text-[#151E23] tracking-tight">
                Everything required for workforce excellence
              </p>
            </div>

            <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div
                onClick={() => onNavigate('reports')}
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
                className="p-6 rounded-2xl bg-[#F8F9FD] border border-[#EFF0F6] cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-[#1B59F8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#151E23] mb-2 group-hover:text-[#1B59F8] transition-colors">
                  Executive Reports &amp; Analytics
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Real-time visibility into starting vs. current knowledge, monthly activity curves, and retention rates across all plant divisions.
                </p>
              </div>

              {/* Card 2 */}
              <div
                onClick={() => onNavigate('library')}
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
                className="p-6 rounded-2xl bg-[#F8F9FD] border border-[#EFF0F6] cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100/60 text-[#10B981] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#151E23] mb-2 group-hover:text-[#10B981] transition-colors">
                  Interactive Microlearning Library
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bite-sized quizzes and ISO procedures designed for 2m 34s session intervals that maximize retention and compliance.
                </p>
              </div>

              {/* Card 3 */}
              <div
                onClick={() => onNavigate('people')}
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
                className="p-6 rounded-2xl bg-[#F8F9FD] border border-[#EFF0F6] cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100/60 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#151E23] mb-2 group-hover:text-purple-600 transition-colors">
                  Team Leaderboards &amp; Culture
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Drive engagement with weekly rank mobility, facility vs. facility competitions, and individual point milestones.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <footer className="bg-white border-t border-[#EFF0F6] py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Tesla Performance Reports</span>
            <span>· Global Workforce Development</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-gray-900 transition-colors">
              About Us
            </button>
            <button onClick={() => onNavigate('reports')} className="hover:text-gray-900 transition-colors">
              Reports Dashboard
            </button>
            <button onClick={() => onNavigate('auth')} className="hover:text-gray-900 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
