'use client';
import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { withGuest } from '../../components/auth/withAuth';
import { useToast } from '../../components/ui/toast';
import Header from '../../components/header';

function LoginPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      // Show success toast
      showToast({
        type: 'success',
        title: 'Login Successful!',
        message: 'Welcome back! You are now logged in.',
        duration: 3000,
      });

      // Navigation will be handled by the AuthProvider redirecting after login
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      
      // Show error toast for better user experience
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
            <span className="text-white text-sm">🌿</span>
          </div>
          <span className="text-lg sm:text-xl font-semibold text-black">
            Urukundo
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-gray-900 text-sm lg:text-base"
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-gray-900 text-sm lg:text-base"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-gray-900 text-sm lg:text-base"
          >
            Contact
          </Link>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium">
            Donate
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          title="Open navigation menu"
          className="md:hidden p-2 text-gray-700 hover:text-gray-900"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      <div className="flex items-center justify-center py-8 sm:py-12 lg:py-20 px-4">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-3 sm:px-4 sm:py-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white border-0 text-sm sm:text-base"
                placeholder="Your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-3 py-3 sm:px-4 sm:py-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white border-0 text-sm sm:text-base"
                placeholder="Password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 sm:py-4 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'LOGIN'
              )}
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm space-y-2 sm:space-y-0">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    handleInputChange('rememberMe', e.target.checked)
                  }
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-black">Remember me</span>
              </label>
              <a
                href="#"
                className="text-orange-500 hover:text-orange-600 text-center sm:text-right"
              >
                Forgot password?
              </a>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don&apos;t have an Account?{' '}
              <a
                href="/signup"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withGuest(LoginPage);
