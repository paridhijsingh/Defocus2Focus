import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'primary',
  trend = null,
  onClick = null 
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      text: 'text-primary-600',
      border: 'border-primary-200'
    },
    focus: {
      bg: 'bg-focus-50',
      text: 'text-focus-600',
      border: 'border-focus-200'
    },
    defocus: {
      bg: 'bg-defocus-50',
      text: 'text-defocus-600',
      border: 'border-defocus-200'
    },
    accent: {
      bg: 'bg-accent-50',
      text: 'text-accent-600',
      border: 'border-accent-200'
    },
    neutral: {
      bg: 'bg-neutral-50',
      text: 'text-neutral-600',
      border: 'border-neutral-200'
    }
  };

  const classes = colorClasses[color];

  return (
    <div 
      className={`card-hover ${classes.bg} ${classes.border} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">{icon}</span>
            <h3 className={`font-semibold ${classes.text}`}>{title}</h3>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">
            {value}
          </div>
          {subtitle && (
            <p className="text-sm text-neutral-600">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend > 0 ? 'text-defocus-600' : 'text-focus-600'
            }`}>
              <span className="mr-1">
                {trend > 0 ? '↗' : '↘'}
              </span>
              {Math.abs(trend)}% from last week
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
