
interface AnimatedProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export default function AnimatedProgress({
  currentStep,
  totalSteps,
  className = "",
}: AnimatedProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div
      className={`relative h-2 rounded-full bg-muted overflow-hidden ${className}`}
    >
      {/* Background shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" />
      
      {/* Progress bar */}
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary shadow-md relative overflow-hidden transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse-glow" />
        
        {/* Moving shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-slide-shine" />
      </div>

      {/* Milestone markers */}
      {Array.from({ length: totalSteps - 1 }).map((_, index) => {
        const markerPosition = ((index + 1) / totalSteps) * 100;
        return (
          <div
            key={index}
            className="absolute top-0 bottom-0 w-px bg-background/50"
            style={{ left: `${markerPosition}%` }}
          />
        );
      })}
    </div>
  );
}
