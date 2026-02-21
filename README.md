# Zaplink — Secure QR Code & File Sharing Platform

## 🔗 About Zaplink

Zaplink is an open-source platform that lets you transform any file, link, or text into a **secure, shareable QR code** — instantly. Whether it's a PDF report, a video, an image, or a URL, Zaplink wraps it in a unique short link and QR code that you can share anywhere.

Every "Zap" (your uploaded content) can be locked with a **password** and configured to **self-destruct** after a set number of views or a time limit — making it ideal for sensitive, time-critical content sharing.

Zaplink also lets you **customize your QR code** with frames, logos, and styles before downloading or sharing it. It's built with React, TypeScript, Vite, and Tailwind CSS, and is maintained by **GDG CHARUSAT** as part of their open-source learning initiative.

## ✨ Features

- 📁 **Multi-format Support** — Upload PDFs, images, videos, audio, documents, presentations, ZIP archives, URLs, and plain text
- 🔐 **Password Protection** — Lock any Zap with a password so only authorized people can access it
- 💣 **Self-Destruct** — Set a view-count limit or an expiry time after which the link stops working automatically
- 🎨 **QR Code Customization** — Choose from frame styles (rounded, circle, shadow, gradient, border) and embed your own logo
- ⚡ **Instant QR Generation** — Get a QR code and short link in seconds, no registration required
- 🌗 **Dark/Light Mode** — Full theme toggle support for a comfortable experience
- 📱 **Fully Responsive** — Works seamlessly on mobile, tablet, and desktop

## 📸 Screenshots

### Home — Choose What to Share
![Home Page](public/screenshots/home.png)

### Step-by-Step Upload Flow
![Steps to Generate](public/screenshots/steps-to-generate.png)

### Things You Can Share
![Things to Share](public/screenshots/things-to-share.png)

---

## 🚀 Quick Start for Contributors

### Prerequisites

- Node.js (v18 or higher)
- npm
- Git

### Installation

1. **Fork this repository** by clicking the "Fork" button at the top right

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Zaplink_frontend.git
   cd Zaplink_frontend
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/gdg-charusat/Zaplink_frontend.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The app will be running at `http://localhost:5173` 🎉

---

## 📚 Contributing

We welcome contributions from developers of all skill levels! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide to get started.

### Finding Issues

Browse our [Issues](https://github.com/gdg-charusat/Zaplink_frontend/issues) page for tasks:

- **Beginner** 🟢: Look for `good-first-issue` or `beginner` labels
- **Intermediate** 🟡: Look for `intermediate` label

### Contribution Workflow

1. Pick an issue and comment to get assigned
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit: `git commit -m "feat: add feature description"`
5. Push: `git push origin feature/your-feature-name`
6. Open a Pull Request

Need help? Check out our detailed [CONTRIBUTING.md](CONTRIBUTING.md) guide!

---

## 🛠 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - Component library

---

## 📁 Project Structure

```
Zaplink_frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   ├── types/          # TypeScript type definitions
│   ├── styles/         # Global styles
│   └── assets/         # Static assets (images, fonts)
├── public/             # Public static files
├── CONTRIBUTING.md     # Contribution guidelines
└── README.md           # This file
```

---

## 🧪 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🤝 Community

- **Event**: GDG CHARUSAT Open Source Contri Sprintathon
- **Discord/WhatsApp**: [Link to community group]
- **Maintainers**: [List maintainer GitHub usernames]

---

## 📜 Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand the expected behavior in our community.

---

## 📝 License

[Add your license here]

---


## 🌟 Contributors

Thanks to all our amazing contributors!

<!-- Add contributor badges or list here -->-

---

## 📞 Need Help?

- 📖 Check the [CONTRIBUTING.md](CONTRIBUTING.md) guide
- 💬 Comment on the issue you're working on
- 🗣️ Ask in the event Discord/WhatsApp group
- 🐛 Found a bug? [Create an issue](https://github.com/gdg-charusat/Zaplink_frontend/issues/new)

---

**Happy Coding! 🚀**

Made with ❤️ by GDG CHARUSAT
