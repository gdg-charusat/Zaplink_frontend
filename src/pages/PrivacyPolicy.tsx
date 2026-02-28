import { Shield } from "lucide-react";

const sections = [
    {
        title: "Information We Collect",
        content:
            "When you use ZapLink, we may collect information you provide directly, such as files you upload and any optional customisation settings (e.g. custom aliases, expiry dates). We do not require account registration to use the core service.",
    },
    {
        title: "How We Use Your Information",
        content:
            "The files and data you share are used solely to provide the ZapLink service — generating shareable links and delivering your content to recipients. We do not sell, rent, or share your data with third parties for marketing purposes.",
    },
    {
        title: "Data Retention",
        content:
            "Uploaded files are stored temporarily and are automatically deleted after the expiry period you set (or within 24 hours by default). We do not retain personal data longer than necessary to operate the service.",
    },
    {
        title: "Cookies & Analytics",
        content:
            "We use minimal, privacy-respecting analytics (Vercel Analytics) to understand aggregate usage patterns. No personally identifiable information is collected through analytics. We do not use advertising cookies.",
    },
    {
        title: "Third-Party Services",
        content:
            "ZapLink is hosted on Vercel and uses industry-standard cloud infrastructure. These providers have their own privacy policies. We do not embed third-party advertising or tracking scripts.",
    },
    {
        title: "Security",
        content:
            "We implement reasonable technical measures to protect your data in transit and at rest. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.",
    },
    {
        title: "Your Rights",
        content:
            "You may request deletion of your uploaded content at any time by using the link management options or contacting us. If you have any privacy concerns, please reach out via our GitHub repository.",
    },
    {
        title: "Changes to This Policy",
        content:
            "We may update this Privacy Policy from time to time. We will indicate the date of the latest revision at the top of this page. Continued use of ZapLink after changes constitutes acceptance of the revised policy.",
    },
];

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background px-4 sm:px-6 py-16 sm:py-24">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg" />
                            <div className="relative bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-lg">
                                <Shield className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-3">
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Last updated: February 2026
                    </p>
                    <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
                        Your privacy matters to us. This policy explains what data ZapLink
                        collects, how it is used, and the choices you have.
                    </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
                    <div className="h-2 w-2 rounded-full bg-primary/50" />
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
                        >
                            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                    {index + 1}
                                </span>
                                {section.title}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <p className="mt-14 text-center text-xs text-muted-foreground/60">
                    Questions? Open an issue on our{" "}
                    <a
                        href="https://github.com/gdg-charusat/Zaplink_frontend"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        GitHub repository
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
