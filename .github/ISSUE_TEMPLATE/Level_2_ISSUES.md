---
name: "🟡 Level 2 - Intermediate Issue"
about: Intermediate-level contribution task for the sprintathon
title: "[INTERMEDIATE] "
labels: ["intermediate", "level_2"]
assignees: ""
---
```
# Sample Intermediate Issues for Zaplink Frontend

These are example issues suitable for intermediate-level contributors participating in the GDG CHARUSAT Open Source Contri Sprintathon. Copy and paste these into GitHub Issues with appropriate labels (`intermediate`, `level-2`).

---

## Issue 1: Implement User Authentication Flow

**Labels**: `intermediate`, `level-2`, `enhancement`, `feature`

**Title**: Implement complete user authentication flow with JWT tokens

**Description**:
Implement a complete authentication system including login, signup, and token management. This should integrate with the backend API and manage authentication state globally.

**Requirements**:
- Create login and signup pages/modals
- Implement JWT token storage (localStorage/sessionStorage)
- Create authentication context for global state
- Add protected route wrapper component
- Implement automatic token refresh
- Handle authentication errors gracefully
- Add logout functionality

**Acceptance Criteria**:
- [ ] Login page/modal with form validation
- [ ] Signup page/modal with password strength indicator
- [ ] AuthContext created with React Context API
- [ ] Protected routes redirect to login when not authenticated
- [ ] JWT tokens stored securely
- [ ] Token refresh implemented (if backend supports)
- [ ] Logout clears all auth data
- [ ] Loading states during authentication
- [ ] Error messages displayed appropriately
- [ ] Proper TypeScript types for all auth-related data

**Technical Details**:
```typescript
// Example AuthContext structure
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}
```

**API Endpoints** (adjust based on your backend):
- POST `/api/auth/login`
- POST `/api/auth/signup`
- POST `/api/auth/refresh`
- POST `/api/auth/logout`

**Estimated Time**: 6-8 hours

**Resources**:
- [React Context API Docs](https://react.dev/reference/react/useContext)
- [JWT Best Practices](https://auth0.com/blog/jwt-authentication-best-practices/)

---

## Issue 2: Build Infinite Scroll with Virtual Scrolling

**Labels**: `intermediate`, `level-2`, `enhancement`, `performance`

**Title**: Implement infinite scroll with virtualization for large lists

**Description**:
Implement an infinite scroll feature for the main feed/list that can handle thousands of items efficiently using virtualization techniques.

**Requirements**:
- Implement virtual scrolling for performance
- Fetch data in chunks as user scrolls
- Show loading indicator while fetching
- Handle edge cases (end of list, errors)
- Debounce scroll events
- Maintain scroll position on route change
- Add pull-to-refresh on mobile

**Acceptance Criteria**:
- [ ] List efficiently handles 1000+ items
- [ ] Smooth scrolling experience (60fps)
- [ ] New data loads when user reaches bottom
- [ ] Loading skeleton shown while fetching
- [ ] Error handling with retry option
- [ ] Scroll position preserved on back navigation
- [ ] Works on mobile and desktop
- [ ] Memory usage remains constant
- [ ] Scroll events debounced (not firing too frequently)

**Technical Approach**:
Consider using `react-window` or `react-virtual` for virtualization, or implement custom solution.

**Example**:
```typescript
interface InfiniteScrollProps<T> {
  items: T[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
}
```

**Estimated Time**: 8-10 hours

**Resources**:
- [react-window](https://github.com/bvaughn/react-window)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

---

## Issue 3: Create Advanced Search with Filters

**Labels**: `intermediate`, `level-2`, `feature`, `enhancement`

**Title**: Implement advanced search functionality with multiple filters

**Description**:
Build a comprehensive search feature that allows users to search and filter content by multiple criteria, with real-time results and URL state sync.

**Requirements**:
- Search input with debounced API calls
- Multiple filter options (category, date range, tags, etc.)
- Filter state synced with URL query parameters
- Clear filters button
- Search results count
- Highlight search terms in results
- Empty state when no results
- Mobile-friendly filter UI (drawer/modal)

**Acceptance Criteria**:
- [ ] Search input with real-time suggestions
- [ ] At least 4 different filter types implemented
- [ ] Filters applied immediately (or with Apply button)
- [ ] URL updates with filter state
- [ ] Direct URL links work with filters applied
- [ ] Clear all filters functionality
- [ ] Results count displayed
- [ ] Search terms highlighted in results
- [ ] Responsive design (desktop + mobile)
- [ ] Loading states during search
- [ ] Debounced search (300-500ms)

**Filter Types to Implement**:
- Text search
- Category dropdown
- Date range picker
- Tags/labels (multi-select)
- Sort order (newest, oldest, popular)

**Technical Details**:
```typescript
interface SearchFilters {
  query: string;
  category: string[];
  dateRange: { start: Date; end: Date } | null;
  tags: string[];
  sortBy: 'newest' | 'oldest' | 'popular';
}
```

**Estimated Time**: 8-12 hours

---

## Issue 4: Implement Real-time Notifications System

**Labels**: `intermediate`, `level-2`, `feature`, `enhancement`

**Title**: Build real-time notification system with WebSocket

**Description**:
Create a notification system that displays real-time updates to users using WebSocket connections, with a notification dropdown and toast notifications.

**Requirements**:
- WebSocket connection for real-time updates
- Notification dropdown in navbar
- Toast notifications for important events
- Mark notifications as read
- Delete notifications
- Notification preferences (optional)
- Sound/vibration on new notification (optional)
- Persist unread count
- Limit number of notifications displayed

**Acceptance Criteria**:
- [ ] WebSocket connection established on authentication
- [ ] New notifications appear in real-time
- [ ] Bell icon shows unread count badge
- [ ] Notification dropdown with list of recent notifications
- [ ] Toast notifications for immediate alerts
- [ ] Mark as read functionality
- [ ] Delete notification functionality
- [ ] Reconnection logic if WebSocket disconnects
- [ ] Notifications persisted on page reload
- [ ] Mobile-responsive design
- [ ] Proper cleanup on component unmount

**Technical Implementation**:
```typescript
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}
```

**WebSocket Events**:
- `notification:new` - New notification received
- `notification:read` - Notification marked as read
- `notification:delete` - Notification deleted

**Estimated Time**: 10-12 hours

---

## Issue 5: Build Drag and Drop File Upload with Preview

**Labels**: `intermediate`, `level-2`, `feature`, `enhancement`

**Title**: Implement drag-and-drop file upload with image preview and progress

**Description**:
Create a robust file upload component that supports drag-and-drop, multiple files, image previews, upload progress, and validation.

**Requirements**:
- Drag and drop area
- Click to browse files
- Multiple file upload support
- Image preview before upload
- Upload progress bar for each file
- File size validation
- File type validation
- Remove file before upload
- Compress images before upload (optional)
- Error handling

**Acceptance Criteria**:
- [ ] Drag and drop zone highlights on dragover
- [ ] Click to browse works
- [ ] Multiple files can be selected
- [ ] Image thumbnails shown before upload
- [ ] Progress bar for each file during upload
- [ ] File size validation (e.g., max 5MB)
- [ ] File type validation (images only, or configurable)
- [ ] Remove button for each file
- [ ] Upload success/error states
- [ ] Responsive design
- [ ] Accessible (keyboard navigation)

**Technical Details**:
```typescript
interface FileUploadProps {
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
  onUpload: (files: File[]) => Promise<void>;
  onError?: (error: string) => void;
}

interface UploadState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  previewUrl?: string;
  error?: string;
}
```

**Estimated Time**: 8-10 hours

**Resources**:
- [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)

---

## Issue 6: Create a Reusable Data Table with Sorting and Pagination

**Labels**: `intermediate`, `level-2`, `enhancement`, `component`

**Title**: Build a generic data table component with sorting, filtering, and pagination

**Description**:
Create a highly reusable data table component that can display any data type with customizable columns, sorting, filtering, and pagination.

**Requirements**:
- Generic TypeScript implementation
- Customizable columns
- Column sorting (ascending/descending)
- Pagination with page size options
- Row selection (single and multi-select)
- Column filtering
- Responsive design (horizontal scroll on mobile)
- Empty state
- Loading state with skeleton

**Acceptance Criteria**:
- [ ] Component accepts generic data type
- [ ] Columns defined with configuration object
- [ ] Click column header to sort
- [ ] Pagination controls (prev, next, page numbers)
- [ ] Page size selector (10, 25, 50, 100)
- [ ] Row selection with checkboxes
- [ ] Filter inputs per column (optional)
- [ ] Responsive on all screen sizes
- [ ] Loading skeleton while fetching data
- [ ] Empty state with custom message
- [ ] Proper TypeScript types
- [ ] Accessible (keyboard navigation, ARIA labels)

**Technical Implementation**:
```typescript
interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRowSelect?: (selectedRows: T[]) => void;
  isLoading?: boolean;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
}
```

**Estimated Time**: 10-12 hours

---

## Issue 7: Implement Form with Complex Validation

**Labels**: `intermediate`, `level-2`, `feature`, `enhancement`

**Title**: Create a multi-step form with comprehensive validation and error handling

**Description**:
Build a multi-step form (e.g., user profile completion, checkout process) with complex validation rules, real-time error messages, and progress tracking.

**Requirements**:
- Multi-step form with progress indicator
- Form validation using a library (react-hook-form, Formik, or Zod)
- Real-time field validation
- Cross-field validation (e.g., password confirmation)
- Async validation (e.g., check username availability)
- Save progress (localStorage)
- Navigate between steps
- Summary page before submission
- Handle submission errors

**Acceptance Criteria**:
- [ ] At least 3 form steps implemented
- [ ] Progress indicator shows current step
- [ ] Each field validates on blur and on change
- [ ] Error messages display under fields
- [ ] Cross-field validation works
- [ ] Async validation for at least one field
- [ ] Can navigate back to previous steps
- [ ] Form data persists in localStorage
- [ ] Summary page shows all data before submission
- [ ] Loading state during submission
- [ ] Success/error feedback after submission
- [ ] Form is accessible (labels, ARIA attributes)

**Example Steps**:
1. Personal Information (name, email, phone)
2. Address Details (street, city, zip, country)
3. Preferences (newsletter, notifications, etc.)
4. Review & Submit

**Technical Details**:
```typescript
// Using react-hook-form + zod example
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
  username: z.string().min(3).max(20),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

**Estimated Time**: 10-14 hours

**Resources**:
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

---

## Issue 8: Build a Theme Customizer with Preview

**Labels**: `intermediate`, `level-2`, `feature`, `enhancement`

**Title**: Create a theme customization system with live preview

**Description**:
Build a theme customizer that allows users to change colors, fonts, and other styling options with live preview, and persist their choices.

**Requirements**:
- Theme customization panel/modal
- Color picker for primary, secondary, accent colors
- Font family selector
- Border radius selector
- Spacing scale selector
- Live preview of changes
- Reset to default theme
- Save theme preferences
- Apply theme globally using CSS variables

**Acceptance Criteria**:
- [ ] Theme customizer UI (panel or modal)
- [ ] Color pickers for at least 3 color values
- [ ] Font family dropdown with 5+ options
- [ ] Border radius slider (0-20px)
- [ ] Changes apply immediately (live preview)
- [ ] Reset button restores defaults
- [ ] Save button persists theme to localStorage
- [ ] Theme loads automatically on app start
- [ ] CSS variables update in real-time
- [ ] Smooth transitions between theme changes
- [ ] Export/import theme configuration (bonus)

**Technical Implementation**:
```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: number;
  spacing: number;
}

// CSS Variables approach
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --font-heading: 'Inter', sans-serif;
  --border-radius: 8px;
}
```

**Estimated Time**: 8-10 hours

---

## How to Use These Issues

1. **Create issues** on GitHub using these templates
2. **Add appropriate labels**: `intermediate`, `level-2`, plus relevant tags
3. **Assign difficulty points** if using a point system (e.g., 15-25 points each)
4. **Be available for questions** as these are more complex issues
5. **Provide architectural guidance** in issue comments if needed
6. **Break down** into smaller tasks if contributors request

## Tips for Maintainers

- These issues require more guidance than beginner issues
- Consider adding architecture diagrams or pseudocode
- Be ready to answer technical questions
- Review PRs in stages (can request WIP PRs)
- Encourage contributors to ask questions early
- Consider pairing experienced contributors with beginners
