import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerService } from '../../services/customer.service';
import { CustomerCard } from '../../components/cards/CustomerCard';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { Plus, Users } from 'lucide-react';
import { CUSTOMER_TYPE } from '../../constants/enums';

export const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await customerService.getAll();
        setCustomers(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const name = (c.companyName || c.user?.name || c.customerCode).toLowerCase();
    const email = (c.user?.email || '').toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const displayedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Spinner size="lg" label="Fetching Customer Accounts..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">Customer Accounts</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage corporate client accounts, residential customers, and contact profiles.
          </p>
        </div>

        <Link to="/customers/create">
          <Button variant="primary" icon={Plus} size="md">
            Add Customer
          </Button>
        </Link>
      </div>

      <div className="p-4 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by customer name, company, or email..."
        />

        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-48 py-1.5 text-xs"
        >
          <option value="">All Account Types</option>
          <option value={CUSTOMER_TYPE.BUSINESS}>Business / Corporate</option>
          <option value={CUSTOMER_TYPE.INDIVIDUAL}>Individual / Residential</option>
        </Select>
      </div>

      {displayedCustomers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customer accounts found"
          description="No customer profiles match your current search criteria."
          actionLabel="Add Customer"
          onAction={() => (window.location.href = '/customers/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedCustomers.map((c) => (
            <CustomerCard key={c._id} customer={c} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredCustomers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
