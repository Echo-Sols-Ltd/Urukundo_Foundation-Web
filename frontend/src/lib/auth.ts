export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'DONOR' | 'MANAGER';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'ADMIN' | 'DONOR' | 'MANAGER';
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface JWTPayload {
  sub: string; // email/username
  exp: number;
  iat: number;
  authorities: string[];
  // Add other claims that might be in the JWT
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://urukundo-fromntend-urukundo-back-1.onrender.com';
// ...existing code...

// Decode JWT payload (real implementation)
export function decodeToken(token: string): JWTPayload | null {
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload;
  } catch {
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

// Get stored tokens
export function getTokens(): {
  accessToken: string | null;
  refreshToken: string | null;
} {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }

  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
}

// Store tokens
export function storeTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

// Clear tokens
export function clearTokens(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

// Extract user info from JWT token
export function getUserFromToken(token: string): User | null {
  const payload = decodeToken(token);
  if (!payload) return null;

  // Extract role from authorities
  const authorities = payload.authorities || [];
  let role: 'ADMIN' | 'DONOR' | 'MANAGER' = 'DONOR';

  if (authorities.includes('ROLE_ADMIN')) {
    role = 'ADMIN';
  } else if (authorities.includes('ROLE_MANAGER')) {
    role = 'MANAGER';
  } else if (authorities.includes('ROLE_DONOR')) {
    role = 'DONOR';
  }

  return {
    id: payload.sub,
    email: payload.sub,
    firstName: '', // We'll need to get this from a user info endpoint
    lastName: '',
    role,
  };
}

// Login function
export async function login(credentials: LoginRequest): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || errorData.error || 'Invalid email or password';
      throw new Error(errorMessage);
    }

    const data: AuthResponse = await response.json();
    storeTokens(data.access_token, data.refresh_token);

    const user = getUserFromToken(data.access_token);
    if (!user) {
      throw new Error('Invalid token received');
    }

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      'Network error. Please check your connection and try again.',
    );
  }
}

// Register function
export async function register(userData: RegisterRequest): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = 'Registration failed';

      if (response.status === 409) {
        errorMessage =
          'Email already exists. Please use a different email address.';
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }

      throw new Error(errorMessage);
    }

    const data: AuthResponse = await response.json();
    storeTokens(data.access_token, data.refresh_token);

    const user = getUserFromToken(data.access_token);
    if (!user) {
      throw new Error('Invalid token received');
    }

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      'Network error. Please check your connection and try again.',
    );
  }
}

// Logout function
export async function logout(): Promise<void> {
  const { accessToken } = getTokens();

  if (accessToken) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API call fails
    }
  }

  clearTokens();
}

// Refresh token function
export async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = getTokens();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data: AuthResponse = await response.json();
    storeTokens(data.access_token, data.refresh_token);
    return data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearTokens();
    return null;
  }
}

// Get current user
export function getCurrentUser(): User | null {
  const { accessToken } = getTokens();

  if (!accessToken) {
    return null;
  }

  if (isTokenExpired(accessToken)) {
    // Try to refresh token automatically
    refreshAccessToken().then((newToken) => {
      if (!newToken) {
        clearTokens();
      }
    });
    return null;
  }

  return getUserFromToken(accessToken);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const { accessToken } = getTokens();

  if (!accessToken) {
    return false;
  }

  return !isTokenExpired(accessToken);
}
