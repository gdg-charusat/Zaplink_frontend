import { ScrollText } from "lucide-react";

const sections = [
    {
        title: "Acceptance of Terms",
        content:
            "By accessing or using ZapLink, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the service. These terms apply to all visitors, users, and anyone who accesses ZapLink.",
    },
    {
        title: "Description of Service",
        content:
            "ZapLink is a fast, secure file-sharing platform that allows users to upload files and generate shareable short links. The service is provided by GDG CHARUSAT and is intended for lawful personal and educational use.",
    },
    {
        title: "Acceptable Use",
        content:
            "You agree to use ZapLink only for lawful purposes. You must not upload, share, or transmit any content that is illegal, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable. You are solely responsible for the content you upload.",
    },
    {
        title: "Prohibited Activities",
        content:
            "The following are strictly prohibited: uploading malware or malicious files; attempting to gain unauthorised access to any part of the service; using ZapLink to distribute spam or unsolicited communications; scraping or automated bulk access without prior permission; and any activity that disrupts or interferes with the service.",
    },
    {
        title: "Intellectual Property",
        content:
            "The ZapLink codebase is open-source and available under its respective licence on GitHub. All original content, branding, and design elements of ZapLink are the property of GDG CHARUSAT. You retain ownership of any files you upload; by uploading, you grant ZapLink a limited licence to store and serve your content for the duration of the link's validity.",
    },
    {
        title: "Limitation of Liability",
        content:
            "ZapLink is provided on an 'as is' basis without warranties of any kind. GDG CHARUSAT shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of — or inability to use — the service, including loss of data.",
    },
    {
        title: "Termination",
        content:
            "We reserve the right to suspend or terminate access to ZapLink at our sole discretion, without notice, for conduct that we believe violates these Terms or is otherwise harmful to other users, us, or third parties.",
    },
    {
        title: "Changes to These Terms",
        content:
            "We may revise these Terms at any time by updating this page. The date of the last revision is shown above. Continued use of ZapLink after changes are posted constitutes your acceptance of the revised Terms.",
    },
];

export default function Terms() {
    return (
        <div className="min-h-screen bg-background px-4 sm:px-6 py-16 sm:py-24">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg" />
                            <div className="relative bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-lg">
                                <ScrollText className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-3">
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Last updated: February 2026
                    </p>
                    <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
                        Please read these terms carefully before using ZapLink. They govern
                        your use of our file-sharing service.
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
