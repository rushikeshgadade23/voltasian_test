import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { technicianService } from '../../services/technician.service';
import { TechnicianCard } from '../../components/cards/TechnicianCard';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { Plus, Wrench } from 'lucide-react';
import { TECHNICIAN_AVAILABILITY } from '../../constants/enums';

export const TechnicianListPage = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchTechnicians() {
      try {
        const res = await technicianService.getAll();
        setTechnicians(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch technicians:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTechnicians();
  }, []);

  const filteredTechnicians = technicians.filter((t) => {
    const name = (t.user?.name || t.employeeCode || '').toLowerCase();
    const skillsStr = (t.skills || []).join(' ').toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || skillsStr.includes(searchQuery.toLowerCase());
    const matchesAvailability = !availabilityFilter || t.availability === availabilityFilter;
    return matchesSearch && matchesAvailability;
  });

  const totalPages = Math.ceil(filteredTechnicians.length / itemsPerPage);
  const displayedTechnicians = filteredTechnicians.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Spinner size="lg" label="Fetching Field Technicians..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">Field Technicians</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage field service engineers, skill certifications, region coverage, and availability.
          </p>
        </div>

        <Link to="/technicians/create">
          <Button variant="primary" icon={Plus} size="md">
            Add Technician
          </Button>
        </Link>
      </div>

      <div className="p-4 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by technician name, skills, or region..."
        />

        <Select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="w-48 py-1.5 text-xs"
        >
          <option value="">All Availabilities</option>
          {Object.values(TECHNICIAN_AVAILABILITY).map((a) => (
            <option key={a} value={a}>
              {a.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </Select>
      </div>

      {displayedTechnicians.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No technicians found"
          description="No technicians match your search filters."
          actionLabel="Add Technician"
          onAction={() => (window.location.href = '/technicians/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedTechnicians.map((t) => (
            <TechnicianCard key={t._id} technician={t} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredTechnicians.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
