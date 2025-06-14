import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Github } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card rounded-xl shadow-lg p-8 space-y-12 border border-border">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Meet the Team Behind ZapLink
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are a team of passionate developers from CHARUSAT University,
              dedicated to creating innovative solutions for document sharing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-background rounded-xl p-6 space-y-4 border border-border">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  KJ
                </span>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Krishnapal Jadeja
                </h3>
                <p className="text-muted-foreground">Full Stack Developer</p>
                <p className="text-sm text-muted-foreground">
                  B.Tech Computer Engineering
                </p>
                <div className="flex justify-center gap-4 pt-2">
                  <a
                    href="mailto:jadejakrishnapal.ce@gmail.com"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl p-6 space-y-4 border border-border">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  VK
                </span>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Vasu Kamani
                </h3>
                <p className="text-muted-foreground">Full Stack Developer</p>
                <p className="text-sm text-muted-foreground">
                  B.Tech Computer Engineering
                </p>
                <div className="flex justify-center gap-4 pt-2">
                  <a
                    href="mailto:vasukamani.ce@gmail.com"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                Our Mission
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                At ZapLink, we're committed to making document sharing and QR
                code generation simple, secure, and efficient. Our goal is to
                provide a seamless experience for users who need to share their
                documents through QR codes.
              </p>
              <Button size="lg" asChild>
                <Link to="/">Try ZapLink Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
