import { useNavigate } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6">
      {/* Main Container */}
      <div className="text-center max-w-2xl w-full">
        {/* Animated Icon */}
        <div className="mb-8 sm:mb-12 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-primary to-primary/80 p-6 sm:p-8 rounded-full shadow-xl">
              <AlertCircle className="h-16 w-16 sm:h-24 sm:w-24 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* 404 Number */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-8xl sm:text-9xl md:text-[140px] font-bold gradient-text leading-none">
            404
          </h1>
        </div>

        {/* Heading */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            It looks like you've wandered into uncharted territory. The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-4 mb-8 sm:mb-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30"></div>
          <div className="h-2 w-2 rounded-full bg-primary/50"></div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30"></div>
        </div>

        {/* Helpful Message */}
        <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12 max-w-md mx-auto">
          Don't worry! Let's get you back on track. Click the button below to return to the home page and continue creating amazing QR codes.
        </p>

        {/* Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus-ring"
          >
            <Home className="h-5 w-5" />
            Go Home
          </button>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl border border-border transition-all duration-300 hover:scale-105 focus-ring"
          >
            Go Back
          </button>
        </div>

        {/* Fun Footer Message */}
        <p className="mt-12 sm:mt-16 text-xs sm:text-sm text-muted-foreground/60">
          Pro tip: While you're here, why not create a secure QR code? That's what we do best! 🚀
        </p>
      </div>
    </div>
  );
}
