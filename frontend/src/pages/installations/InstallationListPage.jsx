import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { installationService } from '../../services/installation.service';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatters';
import { Plus, Compass, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { INSTALLATION_STATUS } from '../../constants/enums';

export const InstallationListPage = () => {
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchInstallations() {
      try {
        const res = await installationService.getAll();
        setInstallations(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch installations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInstallations();
  }, []);

  const filteredInstallations = installations.filter((inst) => {
    const pName = (inst.product?.name || '').toLowerCase();
    const instNum = (inst.installationNumber || '').toLowerCase();
    const matchesSearch = pName.includes(searchQuery.toLowerCase()) || instNum.includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || inst.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInstallations.length / itemsPerPage);
  const displayedInstallations = filteredInstallations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Spinner size="lg" label="Fetching Equipment Installations..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">Equipment Installations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track solar inverter and HVAC equipment commissioning, checklists, and sign-offs.
          </p>
        </div>

        <Link to="/installations/create">
          <Button variant="primary" icon={Plus} size="md">
            Schedule Installation
          </Button>
        </Link>
      </div>

      <div className="p-4 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by installation #, product, or model..."
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48 py-1.5 text-xs"
        >
          <option value="">All Statuses</option>
          {Object.values(INSTALLATION_STATUS).map((st) => (
            <option key={st} value={st}>
              {st.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </Select>
      </div>

      {displayedInstallations.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No installation records found"
          description="No installations match your current filter parameters."
          actionLabel="Schedule Installation"
          onAction={() => (window.location.href = '/installations/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedInstallations.map((inst) => {
            const completedCount = (inst.checklistItems || []).filter((c) => c.isCompleted).length;
            const totalChecklist = (inst.checklistItems || []).length;

            return (
              <div key={inst._id} className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-semibold text-brand-400">{inst.installationNumber}</span>
                    <Badge status={inst.status} size="sm" />
                  </div>

                  <h4 className="text-base font-semibold text-slate-100 line-clamp-1">{inst.product?.name}</h4>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Model: {inst.product?.model || 'N/A'} | S/N: {inst.product?.serialNumber || 'N/A'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Commissioning Checklist</span>
                      <span className="font-semibold text-slate-200">{completedCount}/{totalChecklist} Done</span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-brand-500 h-full transition-all duration-300"
                        style={{ width: `${totalChecklist > 0 ? (completedCount / totalChecklist) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatDate(inst.installationDate)}</span>
                  </div>

                  <Link
                    to={`/installations/${inst._id}`}
                    className="inline-flex items-center gap-1 font-medium text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    View Checklist
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredInstallations.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
