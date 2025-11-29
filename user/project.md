# GigLance Platform - Development Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Frontend UI](#frontend-ui)
4. [Backend User Functions](#backend-user-functions)
5. [Database Structure](#database-structure)
6. [Admin Panel Implementation](#admin-panel-implementation)
7. [Firebase Integration](#firebase-integration)
8. [Authentication & Authorization](#authentication--authorization)
9. [API Endpoints](#api-endpoints)
10. [Development Setup](#development-setup)
11. [Deployment](#deployment)
12. [Security Considerations](#security-considerations)

---

## Project Overview

GigLance is a freelance marketplace platform that connects freelancers with clients. The platform includes:
- User authentication and profiles
- Job posting and bidding system
- Client verification process
- Special badge system
- Admin panel for content moderation

### Purpose
This document serves as a comprehensive guide for developers working on the GigLance platform, with special focus on the admin panel implementation.

### Tech Stack
- **Frontend**: Next.js 13+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Functions
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth (Google Sign-In)
- **Admin Panel**: Standalone HTML/CSS/JS with Firebase SDK

---

## Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client UI     │    │   Admin Panel    │    │   Mobile App    │
│  (Next.js)      │    │  (HTML/CSS/JS)   │    │  (Future)       │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    Firebase Backend       │
                    │  (Auth, Database, Storage) │
                    └───────────────────────────┘
```

### Component Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel wrapper
│   ├── api/               # API routes
│   └── page.tsx           # Main application
├── components/
│   ├── auth-screen.tsx    # Authentication UI
│   ├── giglance-platform.tsx # Main platform wrapper
│   └── pages/             # Page components
├── hooks/
│   └── use-firebase.ts    # Firebase integration hook
└── admin/                 # Standalone admin panel
    ├── index.html         # Admin UI
    └── admin.js           # Admin functionality
```

---

## Frontend UI

### Main Application Components

#### 1. AuthScreen (`components/auth-screen.tsx`)
```typescript
interface AuthScreenProps {
  onSignIn: () => void
  authError?: string | null
  onClearError?: () => void
}
```
- Handles user authentication UI
- Displays Firebase setup errors
- Google Sign-In integration

#### 2. GigLance Platform (`components/giglance-platform.tsx`)
Main platform wrapper that manages:
- User authentication state
- Page navigation
- Admin access control
- Modal management

#### 3. Profile Page (`components/pages/profile-page.tsx`)
User profile management with:
- Admin dashboard access button (conditional)
- User information display
- Role-based features

### UI Framework
- **Styling**: Tailwind CSS
- **Icons**: Lucide React, Font Awesome (admin panel)
- **Components**: Custom React components
- **Responsive**: Mobile-first design

### Admin Panel UI
Standalone HTML application with:
- Modern dashboard design
- Real-time updates
- Toast notifications
- Sidebar navigation
- Card-based layouts

---

## Backend User Functions

### Firebase Integration Hook (`hooks/use-firebase.ts`)

#### Core Functions:
```typescript
// Authentication
const signInWithGoogle = async () => Promise<void>
const signOut = async () => Promise<void>

// User Management
const updateUserProfile = (data: UserProfile) => Promise<void>
const getUserRole = (userId: string) => Promise<string>

// Request Management
const submitClientVerification = (data: ClientRequest) => Promise<void>
const submitJobForApproval = (jobData: JobData) => Promise<void>
const requestBadge = (badgeType: string) => Promise<void>
```

#### State Management:
```typescript
interface FirebaseState {
  user: User | null
  userProfile: UserProfile | null
  isAdmin: boolean
  isLoading: boolean
  authError: string | null
}
```

### API Routes

#### Session Management (`app/api/auth/session/route.ts`)
```typescript
// POST - Create session cookie
// DELETE - Clear session cookie
```

#### User Operations
- Profile updates
- Role management
- Request submissions

---

## Database Structure

### Firebase Realtime Database Schema

```json
{
  "users": {
    "userId": {
      "email": "user@example.com",
      "displayName": "John Doe",
      "photoURL": "https://...",
      "role": "freelancer|client|admin",
      "badges": {
        "verified": true,
        "topRated": true
      },
      "createdAt": 1234567890,
      "lastLogin": 1234567890
    }
  },
  "clientRequests": {
    "requestId": {
      "userId": "userId",
      "userName": "John Doe",
      "userEmail": "user@example.com",
      "companyName": "Acme Inc",
      "companyWebsite": "https://...",
      "companyDescription": "Description...",
      "status": "pending|approved|rejected",
      "timestamp": 1234567890,
      "processedAt": 1234567890,
      "processedBy": "adminId"
    }
  },
  "jobApprovals": {
    "jobId": {
      "jobTitle": "Job Title",
      "description": "Job description",
      "budget": 1000,
      "category": "Development",
      "postedBy": "userId",
      "postedByName": "John Doe",
      "status": "pending|approved|rejected",
      "timestamp": 1234567890,
      "processedAt": 1234567890,
      "processedBy": "adminId"
    }
  },
  "badgeRequests": {
    "requestId": {
      "userId": "userId",
      "userName": "John Doe",
      "userEmail": "user@example.com",
      "badgeType": "verified|topRated|expert",
      "reason": "Request reason...",
      "status": "pending|approved|rejected",
      "timestamp": 1234567890,
      "processedAt": 1234567890,
      "processedBy": "adminId"
    }
  },
  "jobs": {
    "jobId": {
      "title": "Job Title",
      "description": "Description",
      "budget": 1000,
      "category": "Development",
      "postedBy": "userId",
      "status": "active|completed|cancelled",
      "createdAt": 1234567890,
      "approvedAt": 1234567890,
      "approvedBy": "adminId"
    }
  },
  "admins": {
    "adminId": {
      "email": "admin@giglance.com",
      "role": "admin",
      "permissions": ["clientVerification", "jobApproval", "badgeManagement"]
    }
  }
}
```

---

## Admin Panel Implementation

### File Structure
```
admin/
├── index.html          # Admin UI structure
└── admin.js           # Admin functionality
```

### Key Features

#### 1. Authentication
- Firebase Auth integration
- Admin email whitelist validation
- Session management

#### 2. Dashboard Overview
Real-time statistics:
- Total users count
- Active jobs count
- Pending client verifications
- Pending job approvals
- Pending badge requests

#### 3. Client Verification Management
- View pending verification requests
- Approve/reject with reason
- Update user roles automatically
- Real-time updates

#### 4. Job Approval System
- Review submitted jobs
- Approve to publish
- Reject with feedback
- Move to active jobs

#### 5. Badge Request Management
- Review badge applications
- Award special badges
- User profile updates

### Admin.js Core Functions

```javascript
// Authentication
function setupAdminDashboard(user)
function signOutUser()

// Data Loading
function loadDashboardData()
function loadClientVerificationRequests()
function loadJobApprovalRequests()
function loadBadgeRequests()

// Request Handling
function handleRequest(type, id, action)
function approveRequest(requestId)
function rejectRequest(requestId)

// UI Management
function showView(viewId)
function showToast(message, type)
function setupRealtimeListeners()
```

---

## Firebase Integration

### Configuration
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD3qwPX8LkL-VNM3jVHzuCHQDkhjtNRZvY",
  authDomain: "gig-lance.firebaseapp.com",
  databaseURL: "https://gig-lance-default-rtdb.firebaseio.com",
  projectId: "gig-lance",
  storageBucket: "gig-lance.appspot.com",
  messagingSenderId: "921742476464",
  appId: "1:921742476464:web:50b0ea2be127ffa388a775"
};
```

### Security Rules
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('admins').child(auth.uid).exists()",
        ".write": "$uid === auth.uid || root.child('admins').child(auth.uid).exists()"
      }
    },
    "clientRequests": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": "root.child('admins').child(auth.uid).exists()"
    },
    "jobApprovals": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": "root.child('admins').child(auth.uid).exists()"
    },
    "badgeRequests": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": "root.child('admins').child(auth.uid).exists()"
    },
    "jobs": {
      ".read": "true",
      ".write": "auth != null && (data.child('postedBy').val() === auth.uid || root.child('admins').child(auth.uid).exists())"
    },
    "admins": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": "false"
    }
  }
}
```

---

## Authentication & Authorization

### Admin Access Control
```javascript
const ADMIN_EMAILS = ["admin@giglance.com", "dharuncod@gmail.com"];

// Authentication flow
auth.onAuthStateChanged((user) => {
  if (user) {
    if (ADMIN_EMAILS.includes(user.email)) {
      setupAdminDashboard(user);
    } else {
      showToast('You are not authorized to access the admin panel', 'error');
      signOutUser();
    }
  } else {
    window.location.href = '/';
  }
});
```

### User Roles
- **freelancer**: Can bid on jobs, request badges
- **client**: Can post jobs, must be verified
- **admin**: Full access to admin panel

### Session Management
- Firebase Auth tokens
- Session cookies for Next.js
- Automatic token refresh

---

## API Endpoints

### Authentication
```
POST /api/auth/session     # Create session
DELETE /api/auth/session    # Clear session
```

### User Operations
```
PUT /api/user/profile       # Update profile
GET /api/user/role          # Get user role
POST /api/user/verify-client # Request client verification
POST /api/user/request-badge # Request badge
```

### Job Operations
```
POST /api/jobs              # Create job
PUT /api/jobs/approve       # Approve job
GET /api/jobs/pending       # Get pending jobs
```

---

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project setup

### Installation
```bash
# Clone repository
git clone <repository-url>
cd giglance-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_db_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Firebase Setup
1. Create Firebase project
2. Enable Authentication (Google Sign-In)
3. Set up Realtime Database
4. Configure security rules
5. Add admin emails to whitelist

---

## Deployment

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Admin Panel Deployment
The admin panel is served through the Next.js application:
1. Build copies admin files to `public/admin-panel`
2. Accessed via `/admin` route
3. Protected by middleware

### Environment-Specific Configs
- Development: Local Firebase emulator
- Staging: Test Firebase project
- Production: Live Firebase project

---

## Security Considerations

### Authentication
- Firebase Auth with Google Sign-In
- Admin email whitelist
- Session management
- Token validation

### Data Security
- Firebase security rules
- Input validation
- SQL injection prevention (NoSQL)
- XSS protection

### Admin Panel Security
- Role-based access control
- Audit logging
- Secure redirects
- CORS configuration

### Best Practices
1. Always validate user input
2. Implement proper error handling
3. Use environment variables for secrets
4. Regular security updates
5. Monitor admin activities

---

## Future Enhancements

### Planned Features
- Mobile app development
- Advanced analytics dashboard
- Automated moderation
- Multi-language support
- Payment integration

### Scalability Considerations
- Database indexing
- Caching strategies
- CDN implementation
- Load balancing

---

## Troubleshooting

### Common Issues
1. **Firebase Connection**: Check configuration
2. **Admin Access**: Verify email whitelist
3. **Real-time Updates**: Check listeners
4. **Authentication**: Verify domain settings

### Debug Tools
- Firebase Console
- Browser DevTools
- Next.js debugging
- Network monitoring

---

## Contributing Guidelines

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Git hooks for pre-commit

### Testing
- Unit tests with Jest
- Integration tests
- E2E testing with Cypress
- Manual testing checklist

---

## Contact & Support

### Development Team
- Frontend: React/Next.js specialists
- Backend: Firebase/Node.js developers
- DevOps: Deployment and infrastructure

### Resources
- Firebase Documentation
- Next.js Documentation
- React Documentation
- Tailwind CSS Documentation

---

*Last Updated: November 2025*
*Version: 1.0.0*
