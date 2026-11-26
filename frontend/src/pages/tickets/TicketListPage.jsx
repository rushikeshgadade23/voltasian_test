import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/ticket.service';
import { TicketCard } from '../../components/cards/TicketCard';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { Plus, Ticket, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';
import { TICKET_STATUS, TICKET_PRIORITY, TICKET_CATEGORY } from '../../constants/enums';

export const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await ticketService.getAll();
        setTickets(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || t.status === statusFilter;
    const matchesPriority = !priorityFilter || t.priority === priorityFilter;
    const matchesCategory = !categoryFilter || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const displayedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Spinner size="lg" label="Fetching Service Tickets..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">Service Tickets</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage, filter, assign, and track field service requests and maintenance jobs.
          </p>
        </div>

        <Link to="/tickets/create">
          <Button variant="primary" icon={Plus} size="md">
            New Ticket
          </Button>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by ticket #, title, or scope..."
        />

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36 py-1.5 text-xs"
          >
            <option value="">All Statuses</option>
            {Object.values(TICKET_STATUS).map((st) => (
              <option key={st} value={st}>
                {st.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </Select>

          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-32 py-1.5 text-xs"
          >
            <option value="">All Priorities</option>
            {Object.values(TICKET_PRIORITY).map((p) => (
              <option key={p} value={p}>
                {p.toUpperCase()}
              </option>
            ))}
          </Select>

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-36 py-1.5 text-xs"
          >
            <option value="">All Categories</option>
            {Object.values(TICKET_CATEGORY).map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Tickets List View / Grid View */}
      {displayedTickets.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No service tickets found"
          description="No tickets match your search query or filter parameters."
          actionLabel="Create Ticket"
          onAction={() => (window.location.href = '/tickets/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedTickets.map((t) => (
            <TicketCard key={t._id} ticket={t} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredTickets.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
