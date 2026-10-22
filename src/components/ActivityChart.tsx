import React, { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";
import { ActivityMonth } from "../types";
import { DropdownChevron } from "./Icons";

interface ActivityChartProps {
  data: ActivityMonth[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  const [selectedView, setSelectedView] = useState<"Month" | "Week" | "Day">(
    "Month",
  );
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<{
    label: string;
    shortLabel: string;
    value: number;
    users: number;
    quizzes: number;
    rect: DOMRect;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const barsContainerRef = useRef<HTMLDivElement>(null);

  // Generate view datasets
  const getActiveChartData = () => {
    if (selectedView === "Day") {
      return [
        {
          label: "Today at 08:00 AM",
          shortLabel: "8 AM",
          value: 85,
          users: 12,
          quizzes: 40,
        },
        {
          label: "Today at 10:00 AM",
          shortLabel: "10 AM",
          value: 260,
          users: 45,
          quizzes: 210,
        },
        {
          label: "Today at 12:00 PM",
          shortLabel: "12 PM",
          value: 340,
          users: 68,
          quizzes: 380,
        },
        {
          label: "Today at 02:00 PM",
          shortLabel: "2 PM",
          value: 390,
          users: 74,
          quizzes: 490,
        },
        {
          label: "Today at 04:00 PM",
          shortLabel: "4 PM",
          value: 220,
          users: 41,
          quizzes: 230,
        },
        {
          label: "Today at 06:00 PM",
          shortLabel: "6 PM",
          value: 110,
          users: 20,
          quizzes: 105,
        },
      ];
    }

    if (selectedView === "Week") {
      return [
        {
          label: "Monday (Current Week)",
          shortLabel: "Mon",
          value: 210,
          users: 42,
          quizzes: 180,
        },
        {
          label: "Tuesday (Current Week)",
          shortLabel: "Tue",
          value: 310,
          users: 58,
          quizzes: 290,
        },
        {
          label: "Wednesday (Current Week)",
          shortLabel: "Wed",
          value: 180,
          users: 36,
          quizzes: 150,
        },
        {
          label: "Thursday (Current Week)",
          shortLabel: "Thu",
          value: 340,
          users: 72,
          quizzes: 340,
        },
        {
          label: "Friday (Current Week)",
          shortLabel: "Fri",
          value: 290,
          users: 61,
          quizzes: 260,
        },
        {
          label: "Saturday (Current Week)",
          shortLabel: "Sat",
          value: 140,
          users: 24,
          quizzes: 110,
        },
        {
          label: "Sunday (Current Week)",
          shortLabel: "Sun",
          value: 95,
          users: 16,
          quizzes: 70,
        },
      ];
    }

    const daysInMonth = 31;
    const currentMonthName = data[data.length - 1]?.month || "October";

    return Array.from({ length: daysInMonth }, (_, index) => {
      const dayNum = index + 1;
      const simulatedVal = Math.round(
        100 + Math.sin(dayNum / 2) * 150 + (dayNum % 5) * 20,
      );
      return {
        label: `${currentMonthName} ${dayNum}`,
        shortLabel: `${dayNum}`,
        value: Math.min(400, Math.max(40, simulatedVal)),
        users: Math.round(20 + (simulatedVal / 400) * 58),
        quizzes: Math.round((simulatedVal / 400) * 350),
      };
    });
  };

  const activeData = getActiveChartData();

  const maxVal = Math.max(...activeData.map((d) => d.value), 400);
  const peakTick = Math.ceil(maxVal / 100) * 100;
  const yTicks = [
    peakTick,
    Math.round(peakTick * 0.75),
    Math.round(peakTick * 0.5),
    Math.round(peakTick * 0.25),
    0,
  ];

  useGSAP(
    () => {
      if (barsContainerRef.current) {
        const barFills = barsContainerRef.current.querySelectorAll(".bar-fill");
        gsap.fromTo(
          barFills,
          { scaleY: 0, transformOrigin: "bottom" },
          {
            scaleY: 1,
            duration: 0.6,
            stagger: 0.02,
            ease: "power2.out",
          },
        );
      }
    },
    { scope: containerRef, dependencies: [selectedView, activeData.length] },
  );

  const handleBarHover = (
    e: React.MouseEvent<HTMLDivElement>,
    enter: boolean,
  ) => {
    const bar = e.currentTarget.querySelector(".bar-fill");
    if (bar) {
      gsap.to(bar, {
        scaleX: enter ? 1.25 : 1,
        filter: enter ? "brightness(1.15)" : "brightness(1)",
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-white border border-[#EFF0F6] rounded-[20px] p-6 h-full flex flex-col justify-between shadow-2xs hover:border-gray-300 transition-all relative"
    >
      {/* Floating Tooltip rendered outside overflow container */}
      <AnimatePresence>
        {hoveredBar && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              top: hoveredBar.rect.top - 50,
              left: hoveredBar.rect.left + hoveredBar.rect.width / 2,
              transform: "translateX(-50%)",
            }}
            className="bg-gray-900 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl whitespace-nowrap z-50 pointer-events-none"
          >
            <div className="font-semibold text-white">
              {hoveredBar.label}: {hoveredBar.value} pts
            </div>
            <div className="text-gray-300 text-[10px]">
              {hoveredBar.users} active learners · {hoveredBar.quizzes} quizzes
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EFF0F6]">
        <h3 className="text-sm md:text-base font-semibold text-[#151E23] tracking-tight">
          Activity
        </h3>

        <div className="relative">
          <button
            onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer border border-[#EFF0F6]"
          >
            <span>{selectedView}</span>
            <DropdownChevron className="w-2.5 h-2.5" />
          </button>

          <AnimatePresence>
            {isViewMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                className="absolute right-0 top-full mt-1 w-28 bg-white border border-[#EFF0F6] rounded-xl shadow-lg py-1 z-20"
              >
                {(["Month", "Week", "Day"] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => {
                      setSelectedView(view);
                      setIsViewMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                      selectedView === view
                        ? "font-semibold text-[#1B59F8] bg-blue-50/50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chart Body */}
      <div className="relative pt-6 flex flex-1 overflow-hidden">
        {/* Y Axis Labels */}
        <div className="flex flex-col justify-between text-[10px] font-semibold text-[#848A95] pr-3 h-45 select-none text-right w-7 shrink-0 border-r border-gray-100/50 z-20 bg-white">
          {yTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        {/* Horizontal Scroll Area for Bars */}
        <div className="flex-1 relative overflow-x-auto overflow-y-hidden scrollbar-thin">
          <div className="min-w-full relative flex flex-col justify-end h-full">
            {/* Horizontal Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
              {yTicks.map((tick) => (
                <div
                  key={tick}
                  className="w-full border-b border-gray-100/70 border-dashed"
                />
              ))}
            </div>

            {/* Bars Container */}
            <div
              ref={barsContainerRef}
              className={`relative flex items-end h-45 z-10 px-2 gap-2 sm:gap-3 ${
                selectedView === "Month"
                  ? "min-w-160 justify-between"
                  : "justify-around w-full"
              }`}
            >
              {activeData.map((item) => {
                const barHeightPercent = Math.max(
                  8,
                  (item.value / peakTick) * 100,
                );
                const isHovered = hoveredBar?.shortLabel === item.shortLabel;

                return (
                  <div
                    key={item.shortLabel}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredBar({
                        label: item.label,
                        shortLabel: item.shortLabel,
                        value: item.value,
                        users: item.users,
                        quizzes: item.quizzes,
                        rect,
                      });
                      handleBarHover(e, true);
                    }}
                    onMouseLeave={(e) => {
                      setHoveredBar(null);
                      handleBarHover(e, false);
                    }}
                    className="flex flex-col items-center group cursor-pointer relative shrink-0 min-w-4"
                  >
                    {/* Bar Capsule */}
                    <div className="w-2.5 sm:w-3 h-37.5 bg-[#EFF0F6] rounded-full relative flex items-end overflow-hidden group-hover:bg-[#E4E5EB] transition-colors">
                      <div
                        className="bar-fill w-full rounded-full bg-[#1B59F8] transition-colors origin-bottom"
                        style={{ height: `${barHeightPercent}%` }}
                      />
                    </div>

                    {/* Day / Hour / Month Label */}
                    <span
                      className={`mt-2 text-[9px] font-medium transition-colors select-none ${
                        isHovered
                          ? "text-[#1B59F8] font-bold scale-110"
                          : "text-[#848A95] group-hover:text-gray-900"
                      }`}
                    >
                      {item.shortLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
