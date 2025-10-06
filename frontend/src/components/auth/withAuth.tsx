'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

// Loading component
const AuthLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Base HOC for authentication
export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  options: {
    requireAuth?: boolean;
    requiredRole?: 'ADMIN' | 'DONOR' | 'MANAGER';
    redirectTo?: string;
  } = {},
) {
  const { requireAuth = true, requiredRole, redirectTo = '/login' } = options;

  return function AuthenticatedComponent(props: T) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;

      // If auth is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // If auth is not required but user is authenticated (for login/signup pages)
      if (!requireAuth && isAuthenticated) {
        const dashboardRoute = user?.role === 'ADMIN' ? '/admin' : '/donation';
        router.push(dashboardRoute);
        return;
      }

      // If specific role is required
      if (requiredRole && user && user.role !== requiredRole) {
        // Redirect based on user's actual role
        const userDashboard = user.role === 'ADMIN' ? '/admin' : '/donation';
        router.push(userDashboard);
        return;
      }
    }, [isAuthenticated, isLoading, user, router]);

    // Show loading while checking authentication
    if (isLoading) {
      return <AuthLoading />;
    }

    // If requiring auth but not authenticated, don't render
    if (requireAuth && !isAuthenticated) {
      return <AuthLoading />;
    }

    // If not requiring auth but user is authenticated, don't render
    if (!requireAuth && isAuthenticated) {
      return <AuthLoading />;
    }

    // If specific role required but user doesn't have it, don't render
    if (requiredRole && (!user || user.role !== requiredRole)) {
      return <AuthLoading />;
    }

    return <WrappedComponent {...props} />;
  };
}

// HOC for admin-only pages
export function withAdminAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
) {
  return withAuth(WrappedComponent, {
    requireAuth: true,
    requiredRole: 'ADMIN',
    redirectTo: '/login',
  });
}

// HOC for donor pages
export function withDonorAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
) {
  return withAuth(WrappedComponent, {
    requireAuth: true,
    requiredRole: 'DONOR',
    redirectTo: '/login',
  });
}

// HOC for manager pages
export function withManagerAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
) {
  return withAuth(WrappedComponent, {
    requireAuth: true,
    requiredRole: 'MANAGER',
    redirectTo: '/login',
  });
}

// HOC for any authenticated user
export function withAnyAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
) {
  return withAuth(WrappedComponent, {
    requireAuth: true,
    redirectTo: '/login',
  });
}

// HOC for guest-only pages (login, signup)
export function withGuest<T extends object>(
  WrappedComponent: React.ComponentType<T>,
) {
  return withAuth(WrappedComponent, {
    requireAuth: false,
  });
}
