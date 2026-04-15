import { cn } from "../../lib/utils";

interface SectionDividerProps {
  position: 'top' | 'bottom';
  className?: string;
  fillClass?: string;
  type?: 'wave' | 'zigzag';
}

export function SectionDivider({ position, className, fillClass = "fill-white", type = 'wave' }: SectionDividerProps) {
  const isTop = position === 'top';
  
  return (
    <div className={cn(
      "absolute left-0 w-full overflow-hidden leading-[0] z-10",
      isTop ? "top-0 rotate-180" : "bottom-0",
      className
    )}>
      {type === 'wave' ? (
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.38,198.36,108.57Z" className={fillClass}></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[60px]">
          <path d="M0,0 L60,60 L120,0 L180,60 L240,0 L300,60 L360,0 L420,60 L480,0 L540,60 L600,0 L660,60 L720,0 L780,60 L840,0 L900,60 L960,0 L1020,60 L1080,0 L1140,60 L1200,0 V120 H0 V0 Z" className={fillClass}></path>
        </svg>
      )}
    </div>
  );
}
