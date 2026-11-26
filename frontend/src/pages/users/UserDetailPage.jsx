import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/common/Spinner';
import { formatDate } from '../../utils/formatters';
import { Mail, Phone, Calendar, Shield, ArrowLeft } from 'lucide-react';

export const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userRecord, setUserRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserDetail() {
      try {
        const res = await userService.getById(id);
        if (res.data?.data) {
          setUserRecord(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load user record:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserDetail();
  }, [id]);

  if (loading) {
    return <Spinner size="lg" label="Loading Account Details..." className="min-h-[60vh]" />;
  }

  if (!userRecord) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100">User Account Not Found</h3>
        <Link to="/users">
          <Button variant="outline" icon={ArrowLeft} className="mt-4">
            Back to Users
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/users')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold text-slate-100">System User Profile</h1>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <Avatar src={userRecord.avatar} name={userRecord.name} size="xl" />
          <div>
            <div className="flex items-center gap-2">
              <Badge status={userRecord.role} size="sm" />
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${userRecord.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {userRecord.isActive ? 'Active Account' : 'Disabled'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-1">{userRecord.name}</h2>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3 text-slate-300">
            <Mail className="w-4 h-4 text-slate-500" />
            <span>Email: <strong>{userRecord.email}</strong></span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <Phone className="w-4 h-4 text-slate-500" />
            <span>Phone: <strong>{userRecord.phone || 'N/A'}</strong></span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <Shield className="w-4 h-4 text-slate-500" />
            <span>System Role: <strong className="uppercase">{userRecord.role}</strong></span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Joined Date: <strong>{formatDate(userRecord.createdAt, true)}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
