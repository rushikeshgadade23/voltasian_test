import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { User, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100">Account Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your account details and contact preferences.</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <Avatar src={formData.avatar} name={formData.name} size="xl" />
          <div>
            <div className="flex items-center gap-2">
              <Badge status={user?.role} size="sm" />
              <span className="text-xs text-slate-400">ID: {user?._id}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">{user?.name}</h2>
          </div>
        </div>

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile successfully updated!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            icon={User}
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />

          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={formData.email}
            disabled
            helperText="Email address cannot be changed directly."
          />

          <Input
            label="Phone Number"
            icon={Phone}
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          />

          <Input
            label="Avatar Image URL"
            value={formData.avatar}
            onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
            placeholder="https://images.unsplash.com/photo-..."
          />

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button type="submit" variant="primary" isLoading={saving} size="lg">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
