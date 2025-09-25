'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { withGuest } from '../../components/auth/withAuth';
import { useToast } from '../../components/ui/toast';
import Header from '@/components/header';

function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    gender: 'OTHER' as 'MALE' | 'FEMALE' | 'OTHER',
    donationInterests: {
      education: false,
      health: false,
      artsAndCulture: false,
      environment: false,
      animalWelfare: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      donationInterests: {
        ...prev.donationInterests,
        [interest]: checked,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role === 'partner' ? 'MANAGER' : 'DONOR',
        gender: formData.gender,
      });

      if (result.success) {
        // Show success toast
        showToast({
          type: 'success',
          title: 'Account Created Successfully!',
          message: 'Please log in to access your account.',
          duration: 4000,
        });

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Registration failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* <nav className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100"> */}
        {/* <div className="flex items-center space-x-2"> */}
          {/* <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center"> */}
            {/* <span className="text-white text-sm">🌿</span> */}
          {/* </div> */}
          {/* <span className="text-lg sm:text-xl font-semibold text-black"> */}
            {/* Urukundo */}
          {/* </span> */}
        {/* </div> */}
{/*  */}
        {/* <!~~ Desktop Navigation ~~> */}
        {/* <div className="hidden md:flex items-center space-x-6 lg:space-x-8"> */}
          {/* <a */}
            {/* href="#" */}
            {/* className="text-gray-700 hover:text-gray-900 text-sm lg:text-base" */}
          {/* > */}
            {/* Home */}
          {/* </a> */}
          {/* <a */}
            {/* href="#" */}
            {/* className="text-gray-700 hover:text-gray-900 text-sm lg:text-base" */}
          {/* > */}
            {/* About */}
          {/* </a> */}
          {/* <a */}
            {/* href="#" */}
            {/* className="text-gray-700 hover:text-gray-900 text-sm lg:text-base" */}
          {/* > */}
            {/* Contact */}
          {/* </a> */}
          {/* <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium"> */}
            {/* Donate */}
          {/* </button> */}
        {/* </div> */}
{/*  */}
        {/* <!~~ Mobile Menu Button ~~> */}
        {/* <button */}
          {/* title="Open navigation menu" */}
          {/* className="md:hidden p-2 text-gray-700 hover:text-gray-900" */}
        {/* > */}
          {/* <svg */}
            {/* className="w-6 h-6" */}
            {/* fill="none" */}
            {/* stroke="currentColor" */}
            {/* viewBox="0 0 24 24" */}
          {/* > */}
            {/* <path */}
              {/* strokeLinecap="round" */}
              {/* strokeLinejoin="round" */}
              {/* strokeWidth={2} */}
              {/* d="M4 6h16M4 12h16M4 18h16" */}
            {/* /> */}
          {/* </svg> */}
        {/* </button> */}
      {/* </nav> */}
{/*  */}
<Header />
      <div className="flex items-center justify-center py-16 sm:py-12 lg:py-16 px-4">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-10">
              Create your account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-black mb-2"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange('firstName', e.target.value)
                  }
                  className={`w-full px-3 py-3 sm:px-4 sm:py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white border-0 text-sm sm:text-base ${
                    errors.firstName ? 'ring-2 ring-red-500' : ''
                  }`}
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange('lastName', e.target.value)
                  }
                  className={`w-full px-3 py-3 sm:px-4 sm:py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white border-0 text-sm sm:text-base ${
                    errors.lastName ? 'ring-2 ring-red-500' : ''
                  }`}
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-2"
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
                className={`w-full px-3 py-3 sm:px-4 sm:py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white border-0 text-sm sm:text-base ${
                  errors.email ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="Your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-black mb-2"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-3 sm:px-4 sm:py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white border-0 text-sm sm:text-base ${
                  errors.phone ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="Phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-2"
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
                className={`w-full px-3 py-3 sm:px-4 sm:py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white border-0 text-sm sm:text-base ${
                  errors.password ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-black mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange('confirmPassword', e.target.value)
                }
                className={`w-full px-3 py-3 sm:px-4 sm:py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white border-0 text-sm sm:text-base ${
                  errors.confirmPassword ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-black mb-2"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full px-3 py-3 sm:px-4 sm:py-3 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white border-0 text-sm sm:text-base ${
                  errors.role ? 'ring-2 ring-red-500' : ''
                }`}
              >
                <option value="">Select Your Role</option>
                <option value="donor">Donor</option>
                <option value="volunteer">Volunteer</option>
                <option value="beneficiary">Beneficiary</option>
                <option value="partner">Partner Organization</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-3 sm:mb-4">
                Donation interests
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.donationInterests.education}
                    onChange={(e) =>
                      handleInterestChange('education', e.target.checked)
                    }
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">Education</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.donationInterests.health}
                    onChange={(e) =>
                      handleInterestChange('health', e.target.checked)
                    }
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">Health</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.donationInterests.artsAndCulture}
                    onChange={(e) =>
                      handleInterestChange('artsAndCulture', e.target.checked)
                    }
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Arts & Culture
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.donationInterests.environment}
                    onChange={(e) =>
                      handleInterestChange('environment', e.target.checked)
                    }
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Environment
                  </span>
                </label>

                <label className="flex items-center sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={formData.donationInterests.animalWelfare}
                    onChange={(e) =>
                      handleInterestChange('animalWelfare', e.target.checked)
                    }
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Animal welfare
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-black mb-2"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                value={formData.gender}
                onChange={(e) =>
                  handleInputChange(
                    'gender',
                    e.target.value as 'MALE' | 'FEMALE' | 'OTHER',
                  )
                }
                className="w-full px-3 py-3 sm:px-4 sm:py-3 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white border-0 text-sm sm:text-base"
              >
                <option value="OTHER">Prefer not to say</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.general}
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
                  Creating Account...
                </>
              ) : (
                'REGISTER'
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              Already have an Account?{' '}
              <a
                href="/login"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Sign In
              </a>
            </div>

            <div className="text-center text-xs text-gray-500 mt-4 px-4">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withGuest(SignupPage);
