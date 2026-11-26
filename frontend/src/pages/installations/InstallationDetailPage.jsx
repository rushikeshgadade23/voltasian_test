import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { installationService } from '../../services/installation.service';
import { ChecklistItem } from '../../components/common/ChecklistItem';
import { FileUpload } from '../../components/common/FileUpload';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/common/Spinner';
import { Tabs } from '../../components/common/Tabs';
import { formatDate } from '../../utils/formatters';
import {
  Compass,
  ArrowLeft,
  Edit,
  CheckCircle2,
  Calendar,
  Shield,
  FileCheck,
  Camera,
  FileSignature,
} from 'lucide-react';

export const InstallationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [installation, setInstallation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('checklist');
  const [signedByName, setSignedByName] = useState('');
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    async function loadInstallation() {
      try {
        const res = await installationService.getById(id);
        if (res.data?.data) {
          setInstallation(res.data.data);
          setSignedByName(res.data.data.signOff?.signedByName || '');
        }
      } catch (err) {
        console.error('Failed to load installation details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInstallation();
  }, [id]);

  const handleChecklistToggle = async (index, isCompleted) => {
    if (!installation) return;
    const updatedChecklist = [...(installation.checklistItems || [])];
    updatedChecklist[index].isCompleted = isCompleted;

    setInstallation((prev) => ({ ...prev, checklistItems: updatedChecklist }));

    try {
      await installationService.toggleChecklistItem(id, index, isCompleted);
    } catch (err) {
      console.error('Failed to toggle checklist item:', err);
    }
  };

  const handleSignOffSubmit = async (e) => {
    e.preventDefault();
    setSigning(true);
    try {
      const signOffData = {
        signOff: {
          customerSignatureUrl: 'https://via.placeholder.com/150?text=Customer+Signature',
          signedAt: new Date().toISOString(),
          signedByName,
        },
        status: 'completed',
      };
      await installationService.update(id, signOffData);
      setInstallation((prev) => ({
        ...prev,
        ...signOffData,
      }));
    } catch (err) {
      console.error('Failed to record sign-off:', err);
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Loading Commissioning Details..." className="min-h-[60vh]" />;
  }

  if (!installation) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100">Installation Record Not Found</h3>
        <Link to="/installations">
          <Button variant="outline" icon={ArrowLeft} className="mt-4">
            Back to Installations
          </Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'checklist', label: 'Commissioning Checklist', icon: FileCheck },
    { id: 'photos', label: 'Stage Photos & Attachments', icon: Camera },
    { id: 'signoff', label: 'Customer Sign-off', icon: FileSignature },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/installations')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-400">{installation.installationNumber}</span>
              <Badge status={installation.status} size="sm" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 mt-1">{installation.product?.name}</h1>
            <p className="text-xs font-mono text-slate-400">
              Model: {installation.product?.model || 'N/A'} | S/N: {installation.product?.serialNumber || 'N/A'}
            </p>
          </div>
        </div>

        <Link to={`/installations/${installation._id}/edit`}>
          <Button variant="outline" icon={Edit}>
            Edit Installation
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Technical Safety & Protocol Checklist</h3>
            <span className="text-xs text-brand-400 font-semibold">
              {(installation.checklistItems || []).filter((c) => c.isCompleted).length} / {(installation.checklistItems || []).length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {(installation.checklistItems || []).map((item, idx) => (
              <ChecklistItem
                key={idx}
                label={item.label}
                isCompleted={item.isCompleted}
                onToggle={(val) => handleChecklistToggle(idx, val)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <FileUpload label="Upload Stage Installation Photo (Before / During / After)" multiple />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(installation.photos || []).map((photo, idx) => (
              <div key={idx} className="glass-card rounded-xl overflow-hidden border border-slate-800">
                <img src={photo.url} alt={photo.caption || 'Installation Stage'} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <Badge variant="info" size="sm">{photo.stage || 'Photo'}</Badge>
                  <p className="text-xs text-slate-300 mt-1">{photo.caption || 'No caption provided'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sign-off Tab */}
      {activeTab === 'signoff' && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 max-w-xl mx-auto space-y-6">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-brand-400" />
            <span>Customer Sign-off & Handover</span>
          </h3>

          {installation.signOff?.signedAt ? (
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-2 text-sm">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Signed Off & Approved</span>
              </div>
              <p>Signed By: <strong>{installation.signOff.signedByName}</strong></p>
              <p className="text-xs text-emerald-400">Date: {formatDate(installation.signOff.signedAt, true)}</p>
            </div>
          ) : (
            <form onSubmit={handleSignOffSubmit} className="space-y-4">
              <Input
                label="Signatory Full Name"
                placeholder="e.g., Vikram Patel"
                value={signedByName}
                onChange={(e) => setSignedByName(e.target.value)}
                required
              />

              <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900 text-center text-xs text-slate-400">
                [Digital Signature Canvas Simulator]
              </div>

              <Button type="submit" variant="success" isLoading={signing} className="w-full py-3" size="lg">
                Submit Sign-off & Complete Installation
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
