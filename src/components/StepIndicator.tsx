import { Check } from "lucide-react";
import React from "react";

interface Step {
  label: string;
  icon: React.ReactNode;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export default function StepIndicator({
  steps,
  currentStep,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Desktop: Horizontal Layout */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-10">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{
              width: `${(completedSteps.length / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = currentStep === stepNumber;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div
              key={stepNumber}
              className="flex flex-col items-center gap-2 relative"
            >
              {/* Step Circle */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300 ease-in-out
                  ${
                    isCompleted
                      ? "bg-primary text-primary-foreground shadow-lg scale-110"
                      : isCurrent
                      ? "bg-primary/20 text-primary border-2 border-primary animate-pulse-slow"
                      : "bg-muted text-muted-foreground border-2 border-border"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="h-6 w-6 animate-scale-in" />
                ) : (
                  <div className="text-sm">{step.icon}</div>
                )}
              </div>

              {/* Step Label */}
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`
                    text-xs font-medium transition-colors duration-300
                    ${
                      isCompleted || isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {step.label}
                </span>
                <span
                  className={`
                    text-[10px] font-semibold transition-colors duration-300
                    ${
                      isCompleted
                        ? "text-primary"
                        : isCurrent
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? "✓" : isCurrent ? "●" : "○"} Step {stepNumber}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: Vertical Layout */}
      <div className="sm:hidden flex flex-col gap-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = currentStep === stepNumber;

          return (
            <div
              key={stepNumber}
              className="flex items-center gap-4 relative"
            >
              {/* Step Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  transition-all duration-300 ease-in-out
                  ${
                    isCompleted
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : isCurrent
                      ? "bg-primary/20 text-primary border-2 border-primary animate-pulse-slow"
                      : "bg-muted text-muted-foreground border-2 border-border"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <div className="text-xs">{step.icon}</div>
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1">
                <div
                  className={`
                    text-sm font-medium transition-colors duration-300
                    ${
                      isCompleted || isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {step.label}
                </div>
                <div
                  className={`
                    text-xs transition-colors duration-300
                    ${
                      isCompleted
                        ? "text-primary"
                        : isCurrent
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? "Complete" : isCurrent ? "In Progress" : "Pending"}
                </div>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-5 top-12 w-0.5 h-8 -z-10">
                  <div
                    className={`
                      h-full transition-colors duration-300
                      ${isCompleted ? "bg-primary" : "bg-border"}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
