import React, { useRef, useState } from 'react';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltIntensity?: number;
  glowColor?: string;
  as?: 'div' | 'article';
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  onClick,
  tiltIntensity = 6,
  glowColor = 'rgba(6, 182, 212, 0.16)',
  as = 'div',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState<string>(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  );
  const [spotlight, setSpotlight] = useState<{
    x: number;
    y: number;
    opacity: number;
  }>({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -tiltIntensity;
    const rotateY = ((x - centerX) / centerX) * tiltIntensity;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) scale3d(1.012, 1.012, 1.012)`
    );
    setSpotlight({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setTransformStyle(
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    );
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  const Component = as;

  return (
    <Component
      ref={cardRef as React.RefObject<HTMLDivElement>}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition:
          spotlight.opacity === 1
            ? 'transform 110ms cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Dynamic Cursor-Following Bioluminescent Spotlight Layer */}
      <div
        aria-hidden="true"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(380px circle at ${spotlight.x}px ${spotlight.y}px, ${glowColor}, transparent 75%)`,
          transition: 'opacity 200ms ease',
        }}
        className="pointer-events-none absolute inset-0 z-0"
      />
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </Component>
  );
};
