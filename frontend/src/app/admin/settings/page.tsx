'use client';

import { useState, useEffect } from 'react';
import Header from '../../../components/admin/dashboard/Header';
import Sidebar from '../../../components/admin/dashboard/Sidebar';
import { withAdminAuth } from '../../../components/auth/withAuth';
import {
  usersApi,
  type UserProfile,
  type ChangePasswordPayload,
} from '../../../lib/api';

function AdminSettingsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState<ChangePasswordPayload>({
    currentPassword: '',
    newPassword: '',
    confirmationPassword: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      setLoading(true);
      const me = await usersApi.getMe();
      setProfile(me);
      setLoading(false);
    };
    fetchMe();
  }, []);

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value } as UserProfile);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSavingProfile(true);
    setMessage(null);
    setError(null);
    const updated = await usersApi.update(profile.id, {
      firstName: profile.firstName,
      lastName: profile.lastName,
      gender: profile.gender ?? undefined,
    });
    if (updated) {
      setProfile(updated);
      setMessage('Profile updated successfully');
    } else {
      setError('Failed to update profile');
    }
    setSavingProfile(false);
  };

  const handleChangePassword = async () => {
    setChangingPassword(true);
    setMessage(null);
    setError(null);
    if (passwordForm.newPassword !== passwordForm.confirmationPassword) {
      setError('New password and confirmation do not match');
      setChangingPassword(false);
      return;
    }
    const ok = await usersApi.changePassword(passwordForm);
    if (ok) {
      setMessage('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmationPassword: '',
      });
    } else {
      setError('Failed to change password');
    }
    setChangingPassword(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Settings"
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
            {message && (
              <div className="bg-green-50 text-green-800 px-4 py-3 rounded">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-800 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Profile Section */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Profile</h2>
                <p className="text-sm text-gray-500">
                  Update your account information
                </p>
              </div>
              <div className="p-6 space-y-4">
                {loading ? (
                  <div>Loading...</div>
                ) : profile ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm text-gray-700 mb-1"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={profile.firstName || ''}
                          onChange={(e) =>
                            handleProfileChange('firstName', e.target.value)
                          }
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm text-gray-700 mb-1"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={profile.lastName || ''}
                          onChange={(e) =>
                            handleProfileChange('lastName', e.target.value)
                          }
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={profile.email}
                          disabled
                          className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="gender"
                          className="block text-sm text-gray-700 mb-1"
                        >
                          Gender
                        </label>
                        <select
                          id="gender"
                          value={profile.gender || ''}
                          onChange={(e) =>
                            handleProfileChange('gender', e.target.value)
                          }
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">Not set</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 disabled:opacity-60"
                      >
                        {savingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-600">
                    Could not load profile.
                  </div>
                )}
              </div>
            </section>

            {/* Password Section */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Change Password</h2>
                <p className="text-sm text-gray-500">
                  Update your password regularly to keep your account secure
                </p>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordForm.confirmationPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmationPassword: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 disabled:opacity-60"
                  >
                    {changingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminSettingsPage);
