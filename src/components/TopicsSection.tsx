import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TopicItem } from '../types';

interface TopicsSectionProps {
  weakest: TopicItem[];
  strongest: TopicItem[];
  onSelectTopic: (topic: TopicItem) => void;
}

export const TopicsSection: React.FC<TopicsSectionProps> = ({
  weakest,
  strongest,
  onSelectTopic,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (containerRef.current) {
        const weakestBars = containerRef.current.querySelectorAll('.weakest-bar');
        const strongestBars = containerRef.current.querySelectorAll('.strongest-bar');

        gsap.fromTo(
          weakestBars,
          { width: '0%' },
          {
            width: (i) => `${weakest[i]?.percentage || 50}%`,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );

        gsap.fromTo(
          strongestBars,
          { width: '0%' },
          {
            width: (i) => `${strongest[i]?.percentage || 90}%`,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }
    },
    { scope: containerRef, dependencies: [weakest, strongest] }
  );

  const handleRowHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    gsap.to(e.currentTarget, {
      x: enter ? 4 : 0,
      backgroundColor: enter ? 'rgba(249, 250, 252, 0.9)' : 'transparent',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Weakest Topics Card */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs hover:border-gray-300 transition-all">
        <div className="pb-4 border-b border-[#EFF0F6]">
          <h3 className="text-sm md:text-base font-semibold text-[#151E23] tracking-tight">
            Weakest Topics
          </h3>
        </div>

        <div className="pt-5 space-y-6">
          {weakest.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              onMouseEnter={(e) => handleRowHover(e, true)}
              onMouseLeave={(e) => handleRowHover(e, false)}
              className="flex items-center gap-4 group cursor-pointer p-1.5 -m-1.5 rounded-xl transition-all"
            >
              {/* Thumbnail Image */}
              <div className="w-12.25 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <img
                  src={topic.imageUrl}
                  alt={topic.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              {/* Progress & Title Column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold text-[#151E23] truncate group-hover:text-[#FF3E13] transition-colors">
                    {topic.title}
                  </span>
                </div>

                {/* Progress Bar with Weakest gradient (#FFBF1A to #FF4080) */}
                <div className="w-full h-2.5 bg-[#EFF0F6] rounded-full overflow-hidden">
                  <div
                    className="weakest-bar h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #FFBF1A 0%, #FF4080 100%)',
                      width: `${topic.percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* Metric Percentage */}
              <div className="text-right shrink-0 min-w-22.5">
                <span className="text-sm font-semibold text-[#151E23]">
                  {topic.correctLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strongest Topics Card */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs hover:border-gray-300 transition-all">
        <div className="pb-4 border-b border-[#EFF0F6]">
          <h3 className="text-sm md:text-base font-semibold text-[#151E23] tracking-tight">
            Strongest Topics
          </h3>
        </div>

        <div className="pt-5 space-y-6">
          {strongest.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              onMouseEnter={(e) => handleRowHover(e, true)}
              onMouseLeave={(e) => handleRowHover(e, false)}
              className="flex items-center gap-4 group cursor-pointer p-1.5 -m-1.5 rounded-xl transition-all"
            >
              {/* Thumbnail Image */}
              <div className="w-12.75 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <img
                  src={topic.imageUrl}
                  alt={topic.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              {/* Progress & Title Column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold text-[#151E23] truncate group-hover:text-[#10B981] transition-colors">
                    {topic.title}
                  </span>
                </div>

                {/* Progress Bar with Strongest gradient (#2FEA9B to #7FDD53) */}
                <div className="w-full h-2.5 bg-[#EFF0F6] rounded-full overflow-hidden">
                  <div
                    className="strongest-bar h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #2FEA9B 0%, #7FDD53 100%)',
                      width: `${topic.percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* Metric Percentage */}
              <div className="text-right shrink-0 min-w-22.5">
                <span className="text-sm font-semibold text-[#151E23]">
                  {topic.correctLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
