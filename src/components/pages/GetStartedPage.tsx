import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { StorageService } from '../../services/storage';
import { OnboardingTask } from '../../types';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  BarChart2,
} from 'lucide-react';

interface GetStartedPageProps {
  onNavigateTab: (tab: string) => void;
}

export const GetStartedPage: React.FC<GetStartedPageProps> = ({
  onNavigateTab,
}) => {
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tasksListRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const loadTasks = () => {
    setTasks(StorageService.getOnboardingTasks());
  };

  useEffect(() => {
    loadTasks();
    const handleUpdate = () => loadTasks();
    window.addEventListener('tesla_storage_updated', handleUpdate);
    return () => window.removeEventListener('tesla_storage_updated', handleUpdate);
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Stagger entrance of tasks
  useGSAP(
    () => {
      if (tasksListRef.current) {
        gsap.fromTo(
          tasksListRef.current.children,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.4,
            ease: 'power2.out',
          }
        );
      }
    },
    { scope: containerRef, dependencies: [tasks.length] }
  );

  // GSAP tween for the progress bar width
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progressPercent}%`,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, [progressPercent]);

  const handleToggle = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const icon = e.currentTarget.querySelector('.task-check-icon');
    if (icon) {
      gsap.fromTo(
        icon,
        { scale: 0.8 },
        { scale: 1.25, duration: 0.25, yoyo: true, repeat: 1, ease: 'back.out(2)' }
      );
    }
    StorageService.toggleOnboardingTask(id);
  };

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    gsap.to(e.currentTarget, {
      y: enter ? -4 : 0,
      scale: enter ? 1.02 : 1,
      boxShadow: enter ? '0 10px 15px -3px rgba(0, 0, 0, 0.06)' : 'none',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1B59F8] text-[11px] font-semibold mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Interactive Onboarding</span>
            </div>
            <h2 className="text-xl font-bold text-[#151E23] tracking-tight">
              Get Started with Tesla Academy
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Complete these setup milestones to configure your facility baseline and unlock full automated reporting.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 min-w-[200px] text-right sm:text-left">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1.5">
              <span>Onboarding Progress</span>
              <span className="text-[#1B59F8] font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-[#1B59F8] to-[#1FE08F] rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 mt-1 block">
              {completedCount} of {tasks.length} milestones finished
            </span>
          </div>
        </div>
      </div>

      {/* Checklist Tasks */}
      <div className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 shadow-2xs">
        <h3 className="text-sm font-semibold text-gray-900 pb-4 border-b border-[#EFF0F6]">
          Setup Milestones (Saves to Localhost)
        </h3>

        <div ref={tasksListRef} className="divide-y divide-[#EFF0F6] pt-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="py-4 first:pt-2 last:pb-2 flex items-start justify-between gap-4 group"
            >
              <div
                onClick={(e) => handleToggle(task.id, e)}
                className="flex items-start gap-3.5 cursor-pointer flex-1"
              >
                <div className="task-check-icon pt-0.5 transition-transform">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#1FE08F] fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                  )}
                </div>

                <div>
                  <h4
                    className={`text-sm font-semibold transition-colors ${
                      task.completed
                        ? 'text-gray-400 line-through'
                        : 'text-gray-900 group-hover:text-[#1B59F8]'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                  +{task.points} pts
                </span>

                {task.targetTab && (
                  <button
                    onClick={() => onNavigateTab(task.targetTab!)}
                    className="p-1.5 text-gray-400 hover:text-[#1B59F8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title={`Go to ${task.targetTab}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Cards with GSAP Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('library')}
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
          className="p-5 rounded-2xl bg-white border border-[#EFF0F6] transition-colors cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1B59F8] flex items-center justify-center mb-3">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1B59F8] transition-colors">
            Take Baseline Quiz
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Test immediate comprehension across 6 core workplace safety topics.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('people')}
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
          className="p-5 rounded-2xl bg-white border border-[#EFF0F6] transition-colors cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
            Enroll Team Member
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Add team colleagues to the localhost directory and assign departments.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('reports')}
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
          className="p-5 rounded-2xl bg-white border border-[#EFF0F6] transition-colors cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <BarChart2 className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
            View Knowledge Scores
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Inspect starting knowledge (64%) vs. current retention (86%).
          </p>
        </div>
      </div>
    </div>
  );
};
