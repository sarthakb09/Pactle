import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { COLORS } from '../constants/colors';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'blue' | 'green' | 'red' | 'purple' | 'gray';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary', 
  text 
}) => {
  const spinnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Animate the spinner
    if (spinnerRef.current) {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: "none"
      });
    }

    // Animate the text if present
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 10 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6,
          ease: "power2.out",
          delay: 0.3
        }
      );
    }
  }, []);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const getColorValue = (colorName: string) => {
    switch (colorName) {
      case 'primary':
        return COLORS.primary.main;
      case 'accent':
        return COLORS.accent.main;
      case 'success':
        return COLORS.success.main;
      case 'warning':
        return COLORS.warning.main;
      case 'error':
        return COLORS.error.main;
      case 'blue':
        return '#2563eb';
      case 'green':
        return '#16a34a';
      case 'red':
        return '#dc2626';
      case 'purple':
        return '#9333ea';
      case 'gray':
        return '#4b5563';
      default:
        return COLORS.primary.main;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        ref={spinnerRef}
        className={`${sizeClasses[size]} border-4 border-border-light rounded-full`}
        style={{
          borderTopColor: getColorValue(color)
        }}
      />
      {text && (
        <p 
          ref={textRef}
          className="text-text-muted text-sm font-medium"
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner; 