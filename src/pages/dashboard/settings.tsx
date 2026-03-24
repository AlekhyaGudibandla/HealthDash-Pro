import { useState } from 'react';
import { User, Bell, Shield, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

type Tab = 'profile' | 'notifications' | 'security';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile form
  const [firstName, setFirstName] = useState('Admin');
  const [lastName, setLastName] = useState('User');
  const [email, setEmail] = useState('admin@demo.com');
  const [license, setLicense] = useState('MD-9482741');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Notification prefs
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSaveProfile = async () => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(email)) errors.email = 'Invalid email format';
    if (!license.trim()) errors.license = 'License number is required';

    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSavingProfile(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSavingProfile(false);
    toast.success('Profile updated successfully!');
  };

  const handleSavePassword = async () => {
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required';
    if (!newPassword) errors.newPassword = 'New password is required';
    else if (newPassword.length < 8) errors.newPassword = 'Minimum 8 characters';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSavingPassword(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSavingPassword(false);
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    toast.success('Password updated successfully!');
  };

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-56 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Update your personal details and practitioner profile.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} error={profileErrors.firstName} />
                  </div>
                  <div>
                    <Input label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} error={profileErrors.lastName} />
                  </div>
                </div>
                <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} error={profileErrors.email} />
                <Input label="Medical License Number" value={license} onChange={e => setLicense(e.target.value)} error={profileErrors.license} />
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isSavingProfile} className="gap-2">
                    {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Change your password to keep your account secure.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} error={passwordErrors.currentPassword} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} error={passwordErrors.newPassword} />
                  <Input label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} error={passwordErrors.confirmPassword} />
                </div>
                {newPassword && (
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${newPassword.length >= i * 3 ? (newPassword.length >= 12 ? 'bg-green-500' : newPassword.length >= 8 ? 'bg-amber-500' : 'bg-red-500') : 'bg-gray-200'}`} />
                    ))}
                  </div>
                )}
                <div className="pt-4 flex items-center justify-between">
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-500 font-medium">Forgot password?</a>
                  <Button variant="outline" onClick={handleSavePassword} disabled={isSavingPassword} className="gap-2">
                    {isSavingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                    {isSavingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Choose how you want to be notified.</p>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { label: 'Email Notifications', desc: 'Receive alerts and summaries via email', checked: emailNotifs, onChange: setEmailNotifs },
                  { label: 'Push Notifications', desc: 'Browser push notifications for real-time alerts', checked: pushNotifs, onChange: setPushNotifs },
                  { label: 'Critical Alerts', desc: 'Immediate alerts when a patient is marked Critical', checked: criticalAlerts, onChange: setCriticalAlerts },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => { item.onChange(!item.checked); toast.success(`${item.label} ${!item.checked ? 'enabled' : 'disabled'}`); }}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${item.checked ? 'bg-primary-600' : 'bg-gray-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.checked ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
