export function DecorativeLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center w-full opacity-80 ${className}`}>
      <div className="h-[1px] w-16 md:w-32 bg-gradient-to-r from-transparent to-gold"></div>
      <div className="mx-4 text-gold">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c0-10 5-13 5-13s-3 1-5 6c-2-5-5-6-5-6s5 3 5 13z"/>
          <path d="M12 15c-3-4-8-3-8-3s4 1 6 5"/>
          <path d="M12 15c3-4 8-3 8-3s-4 1-6 5"/>
        </svg>
      </div>
      <div className="h-[1px] w-16 md:w-32 bg-gradient-to-l from-transparent to-gold"></div>
    </div>
  );
}
