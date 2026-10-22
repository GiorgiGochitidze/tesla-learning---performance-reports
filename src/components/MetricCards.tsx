import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'motion/react';
import { MetricItem } from '../types';
import { SparklineChart } from './SparklineChart';
import { InfoCircleIcon } from './Icons';

interface MetricCardsProps {
  metrics: MetricItem[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Staggered GSAP entrance for the cards
  useGSAP(
    () => {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current.children,
          { opacity: 0, y: 18, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
          }
        );
      }
    },
    { scope: containerRef, dependencies: [metrics.length] }
  );

  // GSAP interactive mouse hover & tilt micro-interaction
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const valueEl = card.querySelector('.metric-value');

    gsap.to(card, {
      y: -4,
      scale: 1.015,
      boxShadow: '0 12px 20px -3px rgba(27, 89, 248, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      borderColor: '#D3E0FD',
      duration: 0.25,
      ease: 'power2.out',
    });

    if (valueEl) {
      gsap.to(valueEl, {
        scale: 1.04,
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const valueEl = card.querySelector('.metric-value');

    gsap.to(card, {
      y: 0,
      scale: 1,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      borderColor: '#EFF0F6',
      duration: 0.25,
      ease: 'power2.out',
    });

    if (valueEl) {
      gsap.to(valueEl, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
    >
      {metrics.map((metric) => {
        const isHovered = activeTooltip === metric.id;
        return (
          <div
            key={metric.id}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative bg-white border border-[#EFF0F6] rounded-[20px] p-5 min-h-38 flex flex-col justify-between shadow-2xs transition-colors cursor-pointer group overflow-hidden"
          >
            {/* Top row: Title & Optional Info icon */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#686873] tracking-tight group-hover:text-gray-900 transition-colors">
                {metric.title}
              </span>

              {metric.infoText && (
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setActiveTooltip(metric.id)}
                    onMouseLeave={() => setActiveTooltip(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTooltip(isHovered ? null : metric.id);
                    }}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    aria-label={`Info about ${metric.title}`}
                  >
                    <InfoCircleIcon className="w-3.5 h-3.5" />
                  </button>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 bottom-full mb-2 w-48 p-2.5 bg-gray-900 text-white text-xs rounded-xl shadow-xl z-20 pointer-events-none"
                      >
                        {metric.infoText}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Middle: Big Metric Value */}
            <div className="my-auto pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="metric-value inline-block text-2xl md:text-[28px] font-bold text-[#151E23] tracking-tight origin-left">
                  {metric.value}
                </span>

                {metric.id === 'starting_knowledge' && (
                  <span className="text-xs text-gray-400 font-medium ml-1">
                    Out of 43
                  </span>
                )}
              </div>
            </div>

            {/* Bottom: Sparkline graph or descriptive subtext */}
            <div className="h-10.5 flex items-end">
              {metric.hasSparkline ? (
                <SparklineChart
                  variant={metric.sparklineVariant || 'current'}
                  className="w-full"
                />
              ) : (
                <p className="text-xs text-[#848A95] font-normal truncate">
                  {metric.subtext}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
