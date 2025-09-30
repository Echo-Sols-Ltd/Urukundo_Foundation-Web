# Authentication System Documentation

## Overview

This authentication system has been completely rewritten to integrate with the existing Spring Boot backend. The system now provides:

- JWT-based authentication with access and refresh tokens
- Role-based access control (ADMIN, DONOR, MANAGER)
- Protected routes with automatic redirects
- Persistent sessions with token refresh
- Integration with Spring Security backend

## Architecture

### Backend Integration

- **API Base URL**: `https://urukundo-production.up.railway.app` (configurable via `NEXT_PUBLIC_API_URL`)
- **Authentication Endpoints**:
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/logout` - User logout
  - `POST /api/auth/refresh-token` - Token refresh

### Frontend Components

#### Core Files

1. **`src/lib/auth.ts`** - Core authentication logic and API integration
2. **`src/contexts/AuthContext.tsx`** - React context for global auth state
3. **`src/components/auth/withAuth.tsx`** - Higher-order components for route protection
4. **`src/app/layout.tsx`** - Root layout with AuthProvider

#### Authentication Functions

- `login(credentials)` - Authenticate user and store tokens
- `register(userData)` - Register new user
- `logout()` - Clear tokens and logout
- `getCurrentUser()` - Get current user from token
- `isAuthenticated()` - Check if user is logged in
- `refreshAccessToken()` - Refresh expired tokens

#### Route Protection HOCs

- `withGuest()` - For login/signup pages (redirects authenticated users)
- `withAuth()` - For any authenticated user
- `withAdminAuth()` - Admin-only access
- `withDonorAuth()` - Donor-only access
- `withManagerAuth()` - Manager-only access
- `withAnyAuth()` - Any authenticated user (ADMIN/DONOR/MANAGER)

## User Registration Fields

The registration form now includes all required backend fields:

```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'ADMIN' | 'DONOR' | 'MANAGER';
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}
```

## JWT Token Structure

The system works with Spring Security JWT tokens:

```json
{
  "sub": "user@example.com", // User email
  "exp": 1234567890, // Expiration timestamp
  "iat": 1234567890, // Issued at timestamp
  "authorities": ["ROLE_DONOR"] // User roles
}
```

## Protected Routes

### Admin Routes (`/admin/*`)

- Requires `ROLE_ADMIN` authority
- Automatically redirects non-admin users to their appropriate dashboard

### Donation Dashboard (`/donation`, `/dashboard`)

- Requires any authenticated user
- Main dashboard for DONOR and MANAGER roles

### Guest Routes (`/login`, `/signup`)

- Only accessible to non-authenticated users
- Automatically redirects authenticated users to appropriate dashboard

## Testing the System

### Prerequisites

1. Spring Boot backend running on `https://urukundo-production.up.railway.app`
2. Frontend development server: `npm run dev`

### Test Scenarios

#### 1. User Registration

1. Navigate to `/signup`
2. Fill out all required fields
3. Select role (DONOR/MANAGER for regular users)
4. Submit form
5. Should automatically login and redirect to appropriate dashboard

#### 2. User Login

1. Navigate to `/login`
2. Enter email and password
3. Submit form
4. Should redirect based on role:
   - ADMIN → `/admin`
   - DONOR/MANAGER → `/dashboard` or `/donation`

#### 3. Route Protection

1. Try accessing `/admin` without login → redirects to `/login`
2. Login as DONOR → try accessing `/admin` → redirects to `/dashboard`
3. Try accessing `/login` while logged in → redirects to dashboard

#### 4. Token Refresh

1. Login and wait for token to near expiration
2. Navigate between pages
3. System should automatically refresh tokens
4. If refresh fails, should logout and redirect to login

## Configuration

### Environment Variables

Create `.env.local` in the frontend root:

```bash
NEXT_PUBLIC_API_URL=https://urukundo-production.up.railway.app
```

### Backend CORS

Ensure backend allows requests from `http://localhost:3000`:

```java
@CrossOrigin(origins = "http://localhost:3000")
```

## Error Handling

The system includes comprehensive error handling:

- Network errors during API calls
- Invalid credentials
- Expired tokens
- Missing authentication
- Role authorization failures

All errors are displayed to users with appropriate messaging.

## Next Steps

1. **User Profile Integration**: Fetch full user profile data from backend
2. **Password Reset**: Implement forgot password functionality
3. **Email Verification**: Add email verification during registration
4. **Session Management**: Add "Remember Me" functionality
5. **Security Headers**: Add CSRF protection and security headers

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check backend CORS configuration
2. **Token Issues**: Verify JWT secret and expiration settings
3. **Routing Issues**: Check HOC implementation and role mappings
4. **State Issues**: Clear localStorage and cookies if auth state is corrupted

### Development Tips

- Use browser DevTools to inspect localStorage tokens
- Check Network tab for API call failures
- Monitor console for authentication errors
- Test with different user roles to verify access control
