import { Link } from "react-router-dom";
import { Github, Linkedin, Zap, Heart, Code, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="bg-card rounded-3xl shadow-lg p-8 sm:p-12 space-y-16 border border-border">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold">About ZapLink</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              Meet the Team Behind ZapLink
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We are passionate developers from CHARUSAT University, dedicated
              to creating innovative solutions that make file sharing simple,
              secure, and beautiful.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="feature-card">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg mb-6">
                  <span className="text-3xl font-bold text-white">KJ</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Krishnapal Jadeja
                </h3>
                <p className="text-primary font-semibold mb-1">
                  Full Stack Developer
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  B.Tech Computer Engineering
                </p>
                <div className="flex justify-center gap-4 mb-6">
                  <a
                    href="https://github.com/krishnapaljadeja"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted/30 hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-110 group focus-ring"
                    style={{ pointerEvents: "auto" }}
                  >
                    <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </a>
                  <a
                    href="http://linkedin.com/in/krishnapal-jadeja-39a4ab1b7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted/30 hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-110 group focus-ring"
                    style={{ pointerEvents: "auto" }}
                  >
                    <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </a>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg mb-6">
                  <span className="text-3xl font-bold text-white">VK</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Vasu Kamani
                </h3>
                <p className="text-primary font-semibold mb-1">
                  Full Stack Developer
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  B.Tech Computer Engineering
                </p>
                <div className="flex justify-center gap-4 mb-6">
                  <a
                    href="https://github.com/vasu-CE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted/30 hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-110 group focus-ring"
                    style={{ pointerEvents: "auto" }}
                  >
                    <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </a>
                  <a
                    href="http://linkedin.com/in/vasu-kamani-11a07b277/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted/30 hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-110 group focus-ring"
                    style={{ pointerEvents: "auto" }}
                  >
                    <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="pt-8 border-t border-border">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
                  <Zap className="h-8 w-8 text-primary" />
                  Our Mission
                </h3>
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  At ZapLink, we believe that sharing files should be as simple
                  as scanning a code. Our mission is to bridge the gap between
                  complex file sharing and user-friendly design, making document
                  sharing accessible to everyone while maintaining the highest
                  standards of security.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">
                    Innovation
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Constantly pushing the boundaries of what's possible with QR
                    technology
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Heart className="h-8 w-8 text-blue-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">
                    User-Centric
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Every feature is designed with our users' needs and
                    experience in mind
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Code className="h-8 w-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">
                    Excellence
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Committed to delivering high-quality, reliable, and secure
                    solutions
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus-ring"
                  asChild
                >
                  <Link to="/">
                    <Zap className="mr-2 h-5 w-5" />
                    Try ZapLink Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
