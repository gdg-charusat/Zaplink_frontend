import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertCircle, Lock, CheckCircle2, Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface AccessQuizProps {
  shortId: string;
  question: string;
  onQuizCorrect: (zapData: { url?: string }) => void;
  onError?: (error: string) => void;
}

export default function AccessQuiz({
  shortId,
  question,
  onQuizCorrect,
  onError,
}: AccessQuizProps) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }

    try {
      setLoading(true);
      // Try to get the file with the quiz answer
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${shortId}?quizAnswer=${encodeURIComponent(
          answer,
        )}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
      // If successful, the answer was correct
      setIsCorrect(true);
      setSubmitted(true);
      toast.success("Correct answer! Accessing file...");
      setTimeout(() => {
        onQuizCorrect(response.data);
      }, 800);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response?.status === 401) {
        // Incorrect answer
        setSubmitted(true);
        setIsCorrect(false);
        toast.error("Incorrect answer. Please try again.");
      } else {
        const errorMsg =
          error.response?.data?.message || error.message || "An error occurred";
        toast.error(errorMsg);
        if (onError) onError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card rounded-3xl shadow-2xl p-8 sm:p-10 border border-border">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
              Access Quiz Required
            </h2>
            <p className="text-muted-foreground text-center mt-2 text-sm sm:text-base">
              Answer the question correctly to access the file
            </p>
          </div>

          {/* Quiz Question */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-muted/40 rounded-xl p-6 border border-border/50">
              <p className="text-foreground text-lg font-medium text-center">
                {question}
              </p>
            </div>

            {/* Answer Input */}
            <div className="space-y-3">
              <Label
                htmlFor="quiz-answer"
                className="text-base font-medium text-foreground"
              >
                Your Answer
              </Label>
              <Input
                id="quiz-answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer..."
                disabled={loading || isCorrect}
                className="input-focus rounded-xl border-border bg-background h-12 text-base focus-ring disabled:opacity-50"
                autoFocus
              />
            </div>

            {/* Status Messages */}
            {submitted && (
              <div
                className={`flex items-center gap-3 p-4 rounded-xl ${
                  isCorrect
                    ? "bg-green-500/10 border border-green-500/30"
                    : "bg-red-500/10 border border-red-500/30"
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-green-600 dark:text-green-400 font-medium text-sm">
                      Correct! Accessing file...
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-600 dark:text-red-400 font-medium text-sm">
                      Incorrect answer. Please try again.
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !answer.trim() || isCorrect}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-ring"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : isCorrect ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Verified
                </>
              ) : (
                "Submit Answer"
              )}
            </Button>

            {/* Info */}
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              Note: Answers are case-insensitive
            </p>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            This file is protected by a quiz for security.
          </p>
        </div>
      </div>
    </div>
  );
}
