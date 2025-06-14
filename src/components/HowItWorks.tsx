import { Link } from "react-router-dom";
import { ArrowLeft, Upload, QrCode, Download } from "lucide-react";
import { Button } from "./ui/button";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              How ZapLink Works
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card rounded-xl shadow-lg p-8 space-y-12 border border-border">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Create QR Codes in Three Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ZapLink makes it easy to create and customize QR codes for your
              PDF documents. Follow these simple steps to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 bg-background p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                1. Upload Your PDF
              </h3>
              <p className="text-muted-foreground">
                Start by selecting your PDF file. Our platform supports PDF
                files of any size. Simply drag and drop or click to browse your
                files.
              </p>
            </div>

            <div className="space-y-4 bg-background p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                2. Customize Your QR Code
              </h3>
              <p className="text-muted-foreground">
                Personalize your QR code with different styles, patterns, and
                frames. Add your logo and choose from various design options to
                make it unique.
              </p>
            </div>

            <div className="space-y-4 bg-background p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                3. Download & Share
              </h3>
              <p className="text-muted-foreground">
                Download your customized QR code in high resolution. Share it
                with others or use it in your documents and presentations.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                Ready to Create Your QR Code?
              </h3>
              <p className="text-muted-foreground">
                Get started now and create your first QR code in minutes.
              </p>
              <Button size="lg" asChild>
                <Link to="/">Create QR Code</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
