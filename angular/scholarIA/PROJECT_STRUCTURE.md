# ScholarIA - Angular Project Structure

## Project Overview
ScholarIA is an educational platform built with Angular featuring role-based access with separate interfaces for users and administrators.

## Directory Structure

```
src/app/
├── components/                    # Public components (shared across the app)
│   ├── home/                     # Home page with sign-in/sign-up buttons
│   ├── sign-in/                  # User login component
│   └── sign-up/                  # User registration component
│
├── modules/                       # Feature modules with lazy loading
│   ├── user/                      # User feature module
│   │   ├── layout/
│   │   │   └── user-layout/      # Common header for all user pages
│   │   ├── components/
│   │   │   ├── user-dashboard/   # User dashboard (default route)
│   │   │   ├── user-courses/     # User courses/learning interface
│   │   │   └── user-profile/     # User profile management
│   │   ├── user.module.ts        # User module definition
│   │   └── user-routing.module.ts # User routing configuration
│   │
│   └── admin/                     # Admin feature module
│       ├── layout/
│       │   └── admin-layout/      # Common sidebar for all admin pages
│       ├── components/
│       │   ├── admin-dashboard/   # Admin dashboard with statistics
│       │   ├── admin-users/       # User management table
│       │   ├── admin-courses/     # Course management
│       │   └── admin-reports/     # Reports & analytics
│       ├── admin.module.ts        # Admin module definition
│       └── admin-routing.module.ts # Admin routing configuration
│
├── app-routing.module.ts          # Main app routing with lazy loading
├── app.module.ts                  # Root module
├── app.component.ts               # Root component
└── app.component.html             # Root template (with router-outlet)
```

## Routing Structure

### Public Routes (/ path)
- `/` - Home page (HomeComponent)
- `/sign-in` - Sign in page (SignInComponent)
- `/sign-up` - Sign up page (SignUpComponent)

### User Routes (/user path)
Protected routes for authenticated users with header layout:
- `/user/dashboard` - User dashboard (default)
- `/user/courses` - Enrolled courses
- `/user/profile` - User profile and settings

### Admin Routes (/admin path)
Protected routes for administrators with sidebar layout:
- `/admin/dashboard` - Admin dashboard with statistics
- `/admin/users` - User management
- `/admin/courses` - Course management
- `/admin/reports` - Reports & analytics

## Module Details

### User Module
**Location:** `src/app/modules/user/`

**Components:**
- **UserLayoutComponent** - Common header layout with navigation
- **UserDashboardComponent** - Welcome screen with stats
- **UserCoursesComponent** - Display enrolled courses
- **UserProfileComponent** - User profile with edit capability

**Features:**
- Sticky header navigation
- Navigation links: Dashboard, Courses, Profile, Logout
- Responsive design

### Admin Module
**Location:** `src/app/modules/admin/`

**Components:**
- **AdminLayoutComponent** - Collapsible sidebar layout
- **AdminDashboardComponent** - Statistics overview
- **AdminUsersComponent** - User management table
- **AdminCoursesComponent** - Course management cards
- **AdminReportsComponent** - Reports list with download

**Features:**
- Collapsible sidebar for better space management
- Navigation with icons
- Responsive mobile layout
- Admin-specific functionality

## Key Features

### Authentication Flow
1. Users land on `/` (Home page)
2. Click "Sign Up" → `/sign-up`
3. Click "Sign In" → `/sign-in`
4. After authentication → `/user/dashboard`

### User Experience
- **Header-based navigation** for users
- Regular dashboard and profile management
- Course enrollment tracking
- Progress monitoring

### Admin Experience
- **Sidebar-based navigation** for administrators
- Dashboard with key metrics
- User management capabilities
- Course management
- Analytics and reports

## Lazy Loading
Both User and Admin modules are lazy-loaded for better performance:
```typescript
{
  path: 'user',
  loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
},
{
  path: 'admin',
  loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
}
```

## Styling
- **Color Scheme:**
  - Primary: #667eea (Purple)
  - Secondary: #764ba2 (Dark Purple)
  - Danger: #f44335 (Red)
  - Text: #333 (Dark Gray)

- **Responsive Design:** All components are mobile-friendly with media queries

## Component Communication
- Used `ngModel` for two-way binding in forms
- Router navigation for page transitions
- Component-level state management

## Future Enhancements
- [ ] Add authentication guard (AuthGuard)
- [ ] Implement real API integration
- [ ] Add state management (NgRx/Akita)
- [ ] Add more user features (certificates, progress tracking)
- [ ] Add more admin features (user analytics, course creation)
- [ ] Add notifications system
- [ ] Implement dark mode

## Running the Application

### Start Development Server
```bash
npm start
```
The app will be available at `http://localhost:4200`

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## Notes
- All components include sample data for demonstration
- TODO comments mark areas needing backend integration
- Forms use FormsModule for two-way binding
- Common module declarations are handled in respective feature modules
