import { cn } from "../../lib/utils";

export function FolkPattern({ className }: { className?: string }) {
  return (
    <div className={cn("absolute pointer-events-none", className)}>
      <div 
        className="w-full h-full animate-[spin_60s_linear_infinite]"
        style={{
          backgroundColor: 'currentColor',
          WebkitMaskImage: 'url(/wzor.png)',
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: 'url(/wzor.png)',
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
      />
    </div>
  );
}
