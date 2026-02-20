# Contributing to Zaplink Frontend

Thank you for your interest in contributing to **Zaplink** as part of the **GDG CHARUSAT Open Source Contri Sprintathon**! 🎉

---

## 🚨 Contribution Rules (Strict Enforcement)

> **Read this section carefully before doing anything. Violations will result in your PR being closed without review.**

- ❌ **Do NOT open PRs for issues unless you are officially assigned**
- ❌ **PRs without a linked issue (or team number) will be closed immediately**
- ❌ **PRs for unassigned issues will be closed without merging**
- ❌ **Do NOT self-assign issues**
- ✅ **Contributors may create new issues for bugs, enhancements, or documentation improvements**, following the Issue Guidelines below
- ✅ **One issue per contributor at a time** - finish and submit before picking another
- ✅ **Only maintainers can assign, review, and merge PRs** - do not ask others to merge your PR
- ✅ **Every PR must include your Team Number** in the description
- ✅ **General improvement PRs** (bug fixes or enhancements outside existing issues) are allowed but reviewed strictly - you must still include your team number and clearly explain the change

---

## 📌 Issue Policy

- Contributors may create new issues for:
  - Bugs
  - UI/UX inconsistencies
  - Documentation improvements
  - Feature suggestions
- Before creating a new issue, check that a similar issue does not already exist
- Use clear, descriptive titles and provide proper details
- To work on an issue, **comment on it requesting assignment** (e.g., *"I'd like to work on this, Team XX"*)
- **Wait for a maintainer to officially assign you** before writing any code
- Once assigned, you must submit your PR within **3-5 days** or the issue will be reassigned
- If you're stuck or unavailable, **comment on the issue** so maintainers can help or reassign

---

## 🚀 Reporting Bugs or Proposing Improvements

Participants are allowed to create new issues for bugs, enhancements, or improvements, provided they follow proper documentation standards.

If you identify:

- A functional bug  
- A UI/UX inconsistency  
- A documentation error  
- A minor or major enhancement  
- A refactor that improves code quality or maintainability  

You must **create a new issue and wait for it to be approved**.

---

### 📌 Important Guidelines

- ✅ Open a new issue describing the problem clearly, and approve it before submitting a Pull Request.
- ✅ Submit a Pull Request with a clear and structured description.  
- ✅ Include your **Team Number** in the PR description.  
- ✅ Clearly explain the problem and the rationale behind your proposed change.  
- ✅ Attach screenshots if the change affects UI.  

These submissions will be treated as **General Improvement Pull Requests** and will undergo **strict review** to ensure:

- Relevance to project scope  
- Code quality and maintainability  
- No unintended side effects  
- Compliance with project standards  

Maintainers reserve the right to close any PR that is:

- Trivial or low-effort  
- Outside the intended scope  
- Poorly documented  
- Not aligned with repository standards  

Please ensure that your contribution is meaningful, well-tested, and professionally presented.

---

## 🔐 Environment Variables & Secrets

Some issues may require environment variables (API keys, secrets, credentials, etc.).

🚨 **Do NOT ask for environment variables in issues or pull requests.**  
🚨 **Do NOT commit secrets to the repository.**

If you need environment variables to work on an assigned issue, please contact the organizers privately:

- 📱 **WhatsApp:** +91-8347036131
- 📧 **Email:** jadejakrishnapal04@gmail.com

Environment details will be shared **only after the issue is officially assigned to you**.

## 🛠 Tech Stack

This project uses:
- **Frontend Framework**: React.js with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Package Manager**: npm

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- A code editor (VS Code recommended)

## 🚀 Getting Started

### Step 1: Fork the Repository

1. Navigate to the [Zaplink Frontend repository](https://github.com/gdg-charusat/Zaplink_frontend)
2. Click the **Fork** button in the top-right corner
3. This creates a copy of the repository in your GitHub account

### Step 2: Clone Your Fork

Clone the forked repository to your local machine:

```bash
git clone https://github.com/YOUR-USERNAME/Zaplink_frontend.git
cd Zaplink_frontend
```

Replace `YOUR-USERNAME` with your GitHub username.

### Step 3: Add Upstream Remote

Add the original repository as an upstream remote to keep your fork synced:

```bash
git remote add upstream https://github.com/gdg-charusat/Zaplink_frontend.git
```

Verify the remotes:

```bash
git remote -v
```

You should see:
- `origin` - your fork (https://github.com/YOUR-USERNAME/Zaplink_frontend.git)
- `upstream` - the original repository (https://github.com/gdg-charusat/Zaplink_frontend.git)

### Step 4: Install Dependencies

```bash
# Install all project dependencies
npm install
```

### Step 5: Start Development Server

```bash
# Start the Vite development server
npm run dev
```

The application should now be running at `http://localhost:5173`

### Step 6: Create a New Branch

**IMPORTANT**: Always create a new branch for your work. Never work directly on the `main` branch.

```bash
# First, sync your fork with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create and switch to a new branch
git checkout -b feature/your-feature-name
```

**Branch Naming Convention:**
- `feature/` - for new features (e.g., `feature/add-login-page`)
- `fix/` - for bug fixes (e.g., `fix/navbar-responsive`)
- `docs/` - for documentation changes (e.g., `docs/update-readme`)
- `style/` - for styling changes (e.g., `style/improve-button-design`)
- `refactor/` - for code refactoring (e.g., `refactor/optimize-components`)

## 💻 Development Workflow

### 1. Pick an Issue

- Browse the [Issues](https://github.com/gdg-charusat/Zaplink_frontend/issues) page
- Look for issues labeled:
  - `good-first-issue` or `beginner` - for beginners (Level 1)
  - `intermediate` - for intermediate level (Level 2)
- **Comment on the issue** with your request and team number, e.g.:
  > *"Hi, I'd like to work on this issue. - Team 07"*
- **Wait to be officially assigned** - do not start writing any code until a maintainer assigns you
- **Do not work on an issue already assigned to someone else**

### 2. Make Your Changes

- Write clean, readable code
- Follow the project's code style guidelines (see below)
- Test your changes thoroughly in the browser
- Ensure the application runs without errors or warnings

### 3. Test Your Changes

```bash
# Run the development server
npm run dev

# Build the project to check for errors
npm run build

# Run linting (if configured)
npm run lint
```

### 4. Commit Your Changes

Write clear, descriptive commit messages following the conventional commits format:

```bash
git add .
git commit -m "feat: add user authentication modal"
```

**Commit Message Format:**
- `feat:` - new feature (e.g., "feat: add dark mode toggle")
- `fix:` - bug fix (e.g., "fix: resolve navbar mobile responsiveness")
- `docs:` - documentation changes (e.g., "docs: update installation guide")
- `style:` - formatting, CSS changes (e.g., "style: improve button hover effects")
- `refactor:` - code restructuring (e.g., "refactor: simplify form validation logic")
- `test:` - adding tests (e.g., "test: add unit tests for auth service")
- `chore:` - maintenance tasks (e.g., "chore: update dependencies")

**Examples of Good Commit Messages:**
```bash
feat: implement user profile page with edit functionality
fix: correct responsive layout issue on mobile devices
style: update color scheme to match brand guidelines
docs: add API integration examples to README
refactor: extract reusable button component
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to your fork on GitHub: `https://github.com/YOUR-USERNAME/Zaplink_frontend`
2. Click **"Compare & pull request"** button
3. Fill out the PR template completely:
   - **Title**: Clear, descriptive title (e.g., "Add loading spinner component")
   - **Team Number**: You **must** state your team number (e.g., `Team 07`) — PRs without this will be closed
   - **Issue Reference**: Link the assigned issue (e.g., `Closes #42`) — PRs without a linked issue will be closed unless it's a general improvement PR
   - **Description**: Explain what changes you made and why
   - **Screenshots**: Add before/after screenshots if UI changes are involved
4. Click **"Create pull request"**

> 💡 **For General Improvement PRs** (bugs or enhancements not linked to any issue): You must still include your **Team Number** and a clear explanation of what you changed and why. These PRs are reviewed strictly.

## 📝 Issue Guidelines

### Finding Issues

Issues are categorized by difficulty level. Contributors may also create well-documented issues for valid improvements.

**Beginner Level (Good First Issues)**
- Simple UI fixes
- Adding basic components
- Documentation improvements
- Minor styling adjustments
- Labels: `good-first-issue`, `beginner`, `level-1`

**Intermediate Level**
- Complex component development
- State management implementation
- API integration
- Responsive design challenges
- Labels: `intermediate`, `level-2`

### How to Request an Issue

1. Find an unassigned issue you want to work on
2. **Comment on the issue** with this format:
   > *"I'd like to work on this. - Team [your team number]"*
3. **Wait for a maintainer to assign it to you** — this is mandatory
4. Once assigned, start working and submit your PR within **3–5 days**
5. If you can't complete it in time, comment to let maintainers know

> ⚠️ Before opening a new issue, ensure:
> - The issue does not already exist
> - It is clearly documented
> - It aligns with the project scope

### Creating a New Issue

When creating a new issue:

1. Use a clear and descriptive title
2. Add a detailed description:
   - What is the problem?
   - Steps to reproduce (if bug)
   - Expected behavior
   - Screenshots (if UI-related)
3. Wait for maintainer review before starting work

⚠️ Do not start working on a self-created issue unless it is assigned to you.

## 🔄 Pull Request Process

### PR Requirements — Non-Negotiable

> PRs that don't meet ALL of the following will be **closed without review**:

- [ ] **Team number stated** in the PR description (e.g., `Team XX`)
- [ ] **Linked to your assigned issue** via `Closes #issue-number` (unless it's a general improvement PR)
- [ ] **You are the assigned contributor** for that issue
- [ ] PR is raised **after** assignment, not before

### Before Submitting

- [ ] Code runs without errors (`npm run dev` works)
- [ ] Project builds successfully (`npm run build`)
- [ ] All new components are properly typed (TypeScript)
- [ ] Tailwind CSS classes used — no inline styles
- [ ] Tested on different screen sizes
- [ ] No console errors or warnings
- [ ] Commit messages follow the conventional format

### PR Review Process

1. A maintainer will review your PR within 24–48 hours
2. You may be asked to make changes — respond promptly
3. Make requested changes and push to the same branch (PR auto-updates)
4. **Only maintainers can approve and merge** — do not request peers to merge

### Addressing Review Comments

```bash
# Make the requested changes, then:
git add .
git commit -m "fix: address review comments"
git push origin feature/your-feature-name
```

### General Improvement PRs (No Issue Linked)

If you want to fix a bug or add a small improvement that isn't part of an existing issue, you may raise a PR directly **only if**:
- It is a genuine improvement (not a trivial change)
- Your **Team Number** is clearly stated in the PR description
- You provide a clear explanation of what you changed and why
- You understand it will be **reviewed strictly** and may be closed if not up to standard

## 🎨 Code Style Guidelines

### TypeScript

```typescript
// ✅ Good - Proper typing
interface UserProps {
  name: string;
  email: string;
  age?: number;
}

const UserCard: React.FC<UserProps> = ({ name, email, age }) => {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-gray-600">{email}</p>
      {age && <p className="text-sm">Age: {age}</p>}
    </div>
  );
};

// ❌ Bad - No types
const UserCard = ({ name, email, age }) => {
  return <div>...</div>;
};
```

### React Components

```typescript
// ✅ Good - Functional component with proper structure
import { useState } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variantClasses = variant === 'primary' 
    ? "bg-blue-600 text-white hover:bg-blue-700" 
    : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <button 
      onClick={onClick} 
      className={`${baseClasses} ${variantClasses}`}
    >
      {label}
    </button>
  );
};

// ❌ Bad - Inline styles, no types
export const Button = ({ label, onClick }) => {
  return (
    <button style={{ padding: '10px' }} onClick={onClick}>
      {label}
    </button>
  );
};
```

### Tailwind CSS

```typescript
// ✅ Good - Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Click Me
  </button>
</div>

// ❌ Bad - Inline styles
<div style={{ display: 'flex', padding: '16px', background: '#fff' }}>
  <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Title</h2>
  <button style={{ padding: '8px 16px', background: '#3b82f6' }}>
    Click Me
  </button>
</div>
```

### File Naming

- **Components**: PascalCase (e.g., `UserProfile.tsx`, `NavigationBar.tsx`)
- **Utils/Helpers**: camelCase (e.g., `formatDate.ts`, `apiClient.ts`)
- **Types/Interfaces**: PascalCase in `.ts` files (e.g., `types.ts`, `interfaces.ts`)

### Folder Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── utils/           # Helper functions
├── types/           # TypeScript types and interfaces
├── styles/          # Global styles
└── assets/          # Images, fonts, etc.
```

## 🆘 Need Help?

- **Issue Discussion**: Comment on the issue you're working on
- **Discord/WhatsApp**: Join the GDG CHARUSAT event group
- **Maintainers**: Tag @maintainer-username in your issue comments
- **Documentation**: Check [React Docs](https://react.dev/), [Vite Docs](https://vitejs.dev/), [Tailwind Docs](https://tailwindcss.com/)

## 🎯 Tips for Success

1. **Start Small**: Begin with beginner issues to understand the codebase
2. **Read Existing Code**: Look at how similar features are implemented
3. **Ask Questions**: It's better to ask than to waste time going in the wrong direction
4. **Be Patient**: Code review takes time, be responsive to feedback
5. **Have Fun**: Open source is about learning and community!

## 📜 Code of Conduct

Please be respectful and professional in all interactions. We're here to learn and help each other grow.

---

**Happy Coding! 🚀**

If you have any questions or need clarification, feel free to reach out to the maintainers or ask in the issue comments.

Thank you for contributing to Zaplink!
