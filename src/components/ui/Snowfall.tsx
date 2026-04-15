import React from 'react';

export const Snowfall: React.FC = () => {
  // Generate 50 random snowflakes
  const snowflakes = Array.from({ length: 50 }).map((_, i) => {
    const left = `${Math.random() * 100}%`;
    const animationDuration = `${Math.random() * 5 + 5}s`;
    const animationDelay = `${Math.random() * 5}s`;
    const opacity = Math.random() * 0.5 + 0.3;
    const size = `${Math.random() * 4 + 2}px`;

    return (
      <div
        key={i}
        className="absolute top-[-10vh] rounded-full bg-white pointer-events-none animate-snowfall"
        style={{
          left,
          width: size,
          height: size,
          opacity,
          animationDuration,
          animationDelay,
        }}
      />
    );
  });

  return <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">{snowflakes}</div>;
};
