import React from 'react';

const ProgressRing = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = 'primary',
  showPercentage = true,
  children 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorClasses = {
    primary: 'stroke-primary-500',
    focus: 'stroke-focus-500',
    defocus: 'stroke-defocus-500',
    accent: 'stroke-accent-500',
    neutral: 'stroke-neutral-500'
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-neutral-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-500 ease-in-out ${colorClasses[color]}`}
        />
      </svg>
      
      {/* Content inside the ring */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          showPercentage && (
            <div className="text-center">
              <div className={`text-2xl font-bold ${colorClasses[color].replace('stroke-', 'text-')}`}>
                {Math.round(progress)}%
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
