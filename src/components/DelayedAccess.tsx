import { useState, useEffect } from "react";
import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

interface DelayedAccessProps {
  unlockTime: Date;
  onUnlocked: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeRemaining(unlockTime: Date): TimeRemaining {
  const now = new Date();
  const totalMs = Math.max(0, unlockTime.getTime() - now.getTime());
  const totalSeconds = Math.floor(totalMs / 1000);

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    total: totalSeconds,
  };
}

export default function DelayedAccess({
  unlockTime,
  onUnlocked,
}: DelayedAccessProps) {
  const [timeRemaining, setTimeRemaining] = useState(() =>
    calculateTimeRemaining(unlockTime),
  );
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Calculate initial time
    const initial = calculateTimeRemaining(unlockTime);
    setTimeRemaining(initial);

    if (initial.total <= 0) {
      setIsUnlocked(true);
      onUnlocked();
      return;
    }

    // Set up interval
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(unlockTime);
      setTimeRemaining(remaining);

      if (remaining.total <= 0) {
        setIsUnlocked(true);
        onUnlocked();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockTime, onUnlocked]);

  if (isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-green-500/20 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl shadow-2xl p-8 sm:p-10 border border-border text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              File Unlocked!
            </h2>
            <p className="text-muted-foreground mb-8">
              This file is now available for access. Refreshing to load it...
            </p>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-green-500/20 px-3 py-4 sm:py-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-xl p-6 sm:p-8 border border-border">
          {/* Header */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-3 animate-pulse">
              <Clock className="w-7 h-7 text-green-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center">
              File Locked
            </h2>
            <p className="text-muted-foreground text-center mt-1 text-xs sm:text-sm">
              Will be available soon
            </p>
          </div>

          {/* Warning Banner */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-6 flex gap-2">
            <AlertTriangle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-600 dark:text-green-400">
              Access scheduled for a later time by the creator.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="space-y-5">
            {/* Large Countdown Display */}
            <div className="bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl p-6 border border-green-500/20 text-center">
              <p className="text-muted-foreground text-xs mb-2 uppercase tracking-wider font-semibold">
                Time Until Access
              </p>

              {/* Detailed breakdown */}
              <div className="grid grid-cols-4 gap-2 mt-6">
                <div>
                  <p className="text-lg sm:text-xl font-bold text-green-500">
                    {timeRemaining.days}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase mt-1">
                    Days
                  </p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-green-500">
                    {timeRemaining.hours}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase mt-1">
                    Hours
                  </p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-green-500">
                    {timeRemaining.minutes}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase mt-1">
                    Minutes
                  </p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-green-500">
                    {timeRemaining.seconds}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase mt-1">
                    Seconds
                  </p>
                </div>
              </div>
            </div>

            {/* Unlock Info */}
            <div className="bg-muted/40 rounded-lg p-4 border border-border/50 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {unlockTime.toLocaleString()}
                </span>
              </p>
            </div>

            {/* Refresh Button */}
            <Button
              onClick={() => window.location.reload()}
              className="w-full h-11 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus-ring"
            >
              Check Again
            </Button>

            {/* Info */}
            <p className="text-xs text-muted-foreground text-center">
              Will auto-refresh when available. Check back manually if needed.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Share this link. Works for everyone once unlocked.
          </p>
        </div>
      </div>
    </div>
  );
}
