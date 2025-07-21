import React from 'react';
import { PieChart, TrendingUp } from 'lucide-react';
import { Course } from '../types';
import { getGPADescription } from '../utils';

interface GPAOverviewProps {
  gpa: number;
  courses: Course[];
}

type PerformanceLevel = 'excellent' | 'good' | 'average' | 'poor';

interface PerformanceStyle {
  textColor: string;
  bgColor: string;
  progressColor: string;
  ringColor: string;
}

const PERFORMANCE_STYLES: Record<PerformanceLevel, PerformanceStyle> = {
  excellent: {
    textColor: 'text-[#0A1931]',
    bgColor: 'bg-[#B3CFE5]',
    progressColor: 'bg-[#0A1931]',
    ringColor: 'text-[#0A1931]',
  },
  good: {
    textColor: 'text-[#1A3D63]',
    bgColor: 'bg-[#B3CFE5]/50',
    progressColor: 'bg-[#1A3D63]',
    ringColor: 'text-[#1A3D63]',
  },
  average: {
    textColor: 'text-[#4A7FA7]',
    bgColor: 'bg-[#B3CFE5]/30',
    progressColor: 'bg-[#4A7FA7]',
    ringColor: 'text-[#4A7FA7]',
  },
  poor: {
    textColor: 'text-[#B3CFE5]',
    bgColor: 'bg-[#1A3D63]',
    progressColor: 'bg-[#B3CFE5]',
    ringColor: 'text-[#B3CFE5]',
  },
};

const getPerformanceLevel = (gpa: number): PerformanceLevel => {
  if (gpa >= 3.5) return 'excellent';
  if (gpa >= 3.0) return 'good';
  if (gpa >= 2.5) return 'average';
  return 'poor';
};

export const GPAOverview: React.FC<GPAOverviewProps> = ({ gpa, courses }) => {
  const validCourses = courses.filter(
    (course) => course.moduleName.trim() && course.credits > 0 && course.grade
  );

  const totalCredits = validCourses.reduce((sum, course) => sum + course.credits, 0);
  const gpaPercentage = Math.min((gpa / 4.0) * 100, 100);
  const description = getGPADescription(gpa);
  const performanceLevel = getPerformanceLevel(gpa);
  const { textColor, bgColor, progressColor, ringColor } = PERFORMANCE_STYLES[performanceLevel];

  return (
    <div className="bg-[#F6FAFD] rounded-xl shadow-lg p-4 h-fit border border-[#B3CFE5]">
      <h2 className="text-2xl font-bold text-[#0A1931] mb-4 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-[#1A3D63] text-[#F6FAFD]">
          <PieChart size={20} />
        </div>
        GPA Overview
      </h2>

      {/* GPA Chart and Badge - Responsive Layout */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
        {/* Pie Chart */}
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="9"
              fill="transparent"
              className="text-[#B3CFE5]"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className={ringColor}
              strokeDasharray={`${gpaPercentage * 2.51} 251`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#0A1931]">{gpa.toFixed(3)}</div>
              <div className="text-sm text-[#4A7FA7]">/ 4.0</div>
            </div>
          </div>
        </div>

        {/* Description & Performance Badge */}
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold text-[#1A3D63] mb-2">{description}</p>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${textColor} ${bgColor}`}
          >
            <TrendingUp size={16} />
            {description} Performance
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-base text-[#4A7FA7] mb-2">
          <span>Progress</span>
          <span>{gpaPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-[#B3CFE5] rounded-full h-3 overflow-hidden">
          <div
            className={`${progressColor} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${gpaPercentage}%` }}
          />
        </div>
      </div>

      {/* Modules & Credits */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-[#F6FAFD] rounded-lg p-4 text-center border border-[#B3CFE5]">
          <div className="text-2xl font-bold text-[#0A1931]">{validCourses.length}</div>
          <div className="text-sm text-[#4A7FA7]">Total Modules</div>
        </div>
        <div className="bg-[#F6FAFD] rounded-lg p-4 text-center border border-[#B3CFE5]">
          <div className="text-2xl font-bold text-[#0A1931]">{totalCredits}</div>
          <div className="text-sm text-[#4A7FA7]">Total Credits</div>
        </div>
      </div>
    </div>
  );
};
