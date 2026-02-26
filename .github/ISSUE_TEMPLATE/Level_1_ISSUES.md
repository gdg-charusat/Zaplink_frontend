---
name: "🟢 Level 1 - Beginner Issue"
about: Beginner-friendly contribution task for the sprintathon
title: "[BEGINNER] "
labels: ["good-first-issue", "beginner", "level_1"]
assignees: ""
---

# Sample Beginner Issues for Zaplink Frontend

These are example issues suitable for beginners participating in the GDG CHARUSAT Open Source Contri Sprintathon. Copy and paste these into GitHub Issues with appropriate labels (`good-first-issue`, `beginner`, `level-1`).

---

## Issue 1: Add Loading Spinner Component

**Labels**: `good-first-issue`, `beginner`, `level-1`, `enhancement`

**Title**: Create a reusable loading spinner component

**Description**:
We need a reusable loading spinner component that can be used throughout the application when data is being fetched or processed.

**Requirements**:
- Create a new component `LoadingSpinner.tsx` in the `src/components` folder
- Use Tailwind CSS for styling (no inline styles)
- Component should accept a `size` prop with values: 'small', 'medium', 'large'
- Use a simple spinning circle animation
- Make it TypeScript compatible with proper prop types

**Acceptance Criteria**:
- [ ] Component file created at `src/components/LoadingSpinner.tsx`
- [ ] Accepts `size` prop ('small' | 'medium' | 'large')
- [ ] Uses only Tailwind CSS classes for styling
- [ ] Properly typed with TypeScript interface
- [ ] Smooth spinning animation
- [ ] Works on all screen sizes

**Example Usage**:
```typescript
<LoadingSpinner size="medium" />
```

**Design Reference**: 
Use a simple circular spinner with a gradient or border animation. Make it look modern and minimal.

**Estimated Time**: 1-2 hours

**Resources**:
- [Tailwind CSS Animation Docs](https://tailwindcss.com/docs/animation)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## Issue 2: Fix Footer Responsiveness on Mobile

**Labels**: `good-first-issue`, `beginner`, `level-1`, `bug`, `responsive`

**Title**: Footer is not responsive on mobile devices

**Description**:
The footer component is not displaying correctly on mobile devices. Elements are overlapping and text is cut off.

**Steps to Reproduce**:
1. Open the application in browser
2. Open developer tools and switch to mobile view (iPhone SE or similar)
3. Scroll to the bottom of the page
4. Notice footer elements overlapping

**Expected Behavior**:
Footer should stack vertically on mobile devices with proper spacing and no text overflow.

**Acceptance Criteria**:
- [ ] Footer displays correctly on mobile screens (320px - 768px)
- [ ] No horizontal overflow
- [ ] Text is readable and not cut off
- [ ] Elements stack vertically with appropriate spacing
- [ ] Social media icons remain visible and clickable
- [ ] Tested on multiple mobile screen sizes

**Technical Details**:
- File location: `src/components/Footer.tsx` (or similar)
- Focus on Tailwind CSS responsive classes (`sm:`, `md:`, `lg:`)

**Estimated Time**: 1-2 hours

---

## Issue 3: Add Hover Effects to Navigation Links

**Labels**: `good-first-issue`, `beginner`, `level-1`, `enhancement`, `UI`

**Title**: Improve UX by adding hover effects to navigation menu links

**Description**:
The navigation menu links currently have no hover effects, making it unclear when users hover over them. We want to add smooth hover transitions to improve user experience.

**Requirements**:
- Add hover effect to all navigation links
- Use smooth transitions (duration: 200-300ms)
- Change color on hover
- Optional: Add underline animation on hover

**Acceptance Criteria**:
- [ ] All nav links have visible hover states
- [ ] Smooth transition animation (no sudden changes)
- [ ] Color changes are accessible (good contrast)
- [ ] Effect works on desktop only (not on mobile)
- [ ] Consistent styling across all nav items

**Technical Details**:
- File: `src/components/Navbar.tsx` or `src/components/Header.tsx`
- Use Tailwind's `hover:` modifier and `transition` classes

**Example**:
```typescript
<a className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
  Home
</a>
```

**Estimated Time**: 1 hour

---

## Issue 4: Update README with Project Description

**Labels**: `good-first-issue`, `beginner`, `level-1`, `documentation`

**Title**: Add comprehensive project description to README

**Description**:
The current README is minimal and doesn't explain what Zaplink does. We need to add a clear project description, features list, and screenshots.

**Requirements**:
- Add "About Zaplink" section explaining what the project does
- Add "Features" section with bullet points
- Add at least 2 screenshots of the application
- Update the project description at the top
- Ensure markdown formatting is correct

**Acceptance Criteria**:
- [ ] Clear project description (2-3 paragraphs)
- [ ] Features list with at least 5 items
- [ ] 2+ screenshots showing key features
- [ ] Proper markdown formatting
- [ ] No grammatical errors
- [ ] Images are optimized (< 500KB each)

**Technical Details**:
- File: `README.md`
- Add images to `/public/screenshots/` folder

**Estimated Time**: 2 hours

---

## Issue 5: Create a 404 Not Found Page

**Labels**: `good-first-issue`, `beginner`, `level-1`, `enhancement`

**Title**: Design and implement a custom 404 error page

**Description**:
When users navigate to a non-existent route, they should see a friendly 404 page instead of a blank screen.

**Requirements**:
- Create a new page component `NotFound.tsx`
- Include a fun illustration or icon
- Display "404 - Page Not Found" message
- Add a button to navigate back to home
- Make it responsive

**Acceptance Criteria**:
- [ ] Component created at `src/pages/NotFound.tsx`
- [ ] Displays "404" in large text
- [ ] Includes helpful message for users
- [ ] "Go Home" button that works
- [ ] Responsive design (mobile + desktop)
- [ ] Uses Tailwind CSS for styling
- [ ] Properly integrated with routing

**Design Inspiration**:
Create something friendly and helpful, not scary. Think about what would make a user smile even though they hit an error.

**Estimated Time**: 2-3 hours

---

## Issue 6: Add Dark Mode Toggle Button UI

**Labels**: `good-first-issue`, `beginner`, `level-1`, `enhancement`, `UI`

**Title**: Create UI for dark mode toggle button (functionality will be added later)

**Description**:
Create a toggle button component for dark mode. This issue focuses only on the UI component - the actual dark mode functionality will be implemented in a separate issue.

**Requirements**:
- Create a toggle switch component
- Should have sun ☀️ and moon 🌙 icons
- Smooth animation when toggling
- Place it in the navbar
- Component should accept `isDark` and `onToggle` props

**Acceptance Criteria**:
- [ ] Component created at `src/components/DarkModeToggle.tsx`
- [ ] Toggle switches smoothly between states
- [ ] Icons change based on state
- [ ] Properly typed with TypeScript
- [ ] Accessible (can be used with keyboard)
- [ ] Positioned correctly in navbar

**Example**:
```typescript
interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}
```

**Estimated Time**: 2 hours

---

## Issue 7: Fix Button Accessibility - Add ARIA Labels

**Labels**: `good-first-issue`, `beginner`, `level-1`, `accessibility`, `bug`

**Title**: Add ARIA labels to icon-only buttons for screen readers

**Description**:
Several buttons in the app only have icons without text, making them inaccessible to screen reader users. We need to add proper ARIA labels.

**Requirements**:
- Find all icon-only buttons in the codebase
- Add `aria-label` attributes with descriptive text
- Ensure each label clearly describes the button's action

**Acceptance Criteria**:
- [ ] All icon buttons have `aria-label` attributes
- [ ] Labels are descriptive and clear
- [ ] No console warnings about accessibility
- [ ] Tested with screen reader (or browser accessibility tools)

**Example**:
```typescript
// ❌ Bad
<button>
  <TrashIcon />
</button>

// ✅ Good
<button aria-label="Delete item">
  <TrashIcon />
</button>
```

**Technical Details**:
Search for buttons with icons in components like Navbar, Sidebar, ActionButtons, etc.

**Estimated Time**: 1-2 hours

**Resources**:
- [ARIA Labels Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)

---

## Issue 8: Add TypeScript Types for User Interface

**Labels**: `good-first-issue`, `beginner`, `level-1`, `types`, `enhancement`

**Title**: Create TypeScript interface for User object

**Description**:
We're using user objects throughout the app but don't have a central type definition. Create a reusable User interface.

**Requirements**:
- Create `src/types/user.ts` file
- Define User interface with common properties
- Export the interface
- Update at least 3 components to use this type

**Acceptance Criteria**:
- [ ] File created at `src/types/user.ts`
- [ ] User interface includes: id, name, email, avatar (optional), createdAt
- [ ] Interface is properly exported
- [ ] At least 3 components updated to use the new type
- [ ] No TypeScript errors

**Example**:
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}
```

**Estimated Time**: 1-2 hours

---

## How to Use These Issues

1. **Create issues** on GitHub using these templates
2. **Add appropriate labels**: `good-first-issue`, `beginner`, `level-1`, plus relevant tags
3. **Assign difficulty points** if using a point system (e.g., 5-10 points each)
4. **Monitor comments** and assign issues to participants who express interest
5. **Review PRs promptly** to keep contributors engaged

## Tips for Maintainers

- Respond to comments within 24 hours
- Be encouraging and supportive
- Provide helpful feedback on PRs
- Thank contributors for their work
- Consider adding "time estimate" to help participants plan
