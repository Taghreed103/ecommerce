interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
    </div>
  );
}

export function ThreeDots({ color = '#000', height = 50, width = 50 }: { color?: string; height?: number; width?: number }) {
  return (
    <div className="flex justify-center items-center space-x-1" style={{ height: `${height}px`, width: `${width}px` }}>
      <div 
        className="w-2 h-2 rounded-full animate-bounce" 
        style={{ backgroundColor: color, animationDelay: '0ms' }}
      ></div>
      <div 
        className="w-2 h-2 rounded-full animate-bounce" 
        style={{ backgroundColor: color, animationDelay: '150ms' }}
      ></div>
      <div 
        className="w-2 h-2 rounded-full animate-bounce" 
        style={{ backgroundColor: color, animationDelay: '300ms' }}
      ></div>
    </div>
  );
}

export function Audio({ color = '#4ebb4cff', height = 100, width = 100, ariaLabel = 'loading', visible = true }: { 
  color?: string; 
  height?: number | string; 
  width?: number | string; 
  ariaLabel?: string;
  visible?: boolean;
}) {
  if (!visible) return null;
  
  return (
    <div 
      className="flex justify-center items-center" 
      style={{ height: `${height}px`, width: `${width}px` }}
      aria-label={ariaLabel}
    >
      <div className="flex space-x-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              width: '4px',
              backgroundColor: color,
              height: '40px',
              animationDelay: `${i * 100}ms`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  );
}
