import React from 'react';
import { motion } from 'motion/react';

interface SparklineProps {
  variant?: 'starting' | 'current' | 'gain';
  width?: number;
  height?: number;
  className?: string;
}

export const SparklineChart: React.FC<SparklineProps> = ({
  variant = 'starting',
  className = '',
}) => {
  const gradientId = `sparkline-gradient-${variant}`;

  // Paths from Figma design
  // Area path:
  const areaPath =
    'M0 19.0336C0 19.0336 4.88798 18.2406 10.4453 20.1457C21.0151 23.7691 21.618 17.1338 25.5374 13.9344C29.1232 11.0073 32.0929 12.7933 36.0854 16.3729C39.0301 19.013 43.3215 23.4447 47.7658 22.7312C51.8284 22.0791 54.7083 16.8813 60.3394 15.5594C64.8024 14.5117 68.4294 17.39 73.5685 16.3729C80.5402 14.9931 83.6544 6.87012 88.637 6.87012C94.7868 6.87012 99.1165 0 104.711 0C110.273 0 111.027 4.03979 117.111 6.87012C121.762 9.03392 124 6.87012 124 6.87012V30.0568H0V19.0336Z';

  // Line path:
  const linePath =
    'M1.00024 19.7745C1.00024 19.7745 5.88822 18.9929 11.4456 20.8705C22.0153 24.4414 22.6183 17.9022 26.5377 14.7491C30.1235 11.8644 33.0932 13.6244 37.0857 17.1522C40.0303 19.7541 44.3218 24.1217 48.7661 23.4186C52.8286 22.7758 55.7086 17.6533 61.3397 16.3505C65.8027 15.318 69.4296 18.1546 74.5688 17.1522C81.5405 15.7924 84.6546 7.78703 89.6373 7.78703C95.787 7.78703 100.117 1 105.711 1C111.273 1 111.568 4.99768 117.652 7.78703C122.303 9.91951 125 7.78703 125 7.78703';

  // Color variants
  const strokeColor =
    variant === 'gain'
      ? '#10B981'
      : variant === 'current'
      ? '#1B59F8'
      : '#3B82F6';

  const stopColor =
    variant === 'gain'
      ? '#10B981'
      : variant === 'current'
      ? '#1B59F8'
      : '#2563EB';

  return (
    <div className={`relative w-full h-[40px] overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 126 31"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="22.41"
            y1="10"
            x2="22.41"
            y2="31"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={stopColor} stopOpacity="0.25" />
            <stop offset="1" stopColor="white" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Fill Area with fade-in */}
        <motion.path
          d={areaPath}
          fill={`url(#${gradientId})`}
          fillRule="evenodd"
          clipRule="evenodd"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Animated Stroke Line */}
        <motion.path
          d={linePath}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
};
