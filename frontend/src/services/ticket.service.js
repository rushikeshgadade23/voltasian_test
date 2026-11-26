import {
  db, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp,
  formatDoc, formatCollection, response, getNextSequence,
} from './api';

export const ticketService = {
  async getAll() {
    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return response(formatCollection(snap));
  },

  async getById(id) {
    const snap = await getDoc(doc(db, 'tickets', id));
    const data = formatDoc(snap);
    if (!data) throw new Error('Ticket not found');
    return response(data);
  },

  async create(data) {
    const seq = await getNextSequence('tickets');
    const ticketNumber = `TKT-${String(seq).padStart(4, '0')}`;
    const docRef = await addDoc(collection(db, 'tickets'), {
      ticketNumber,
      status: 'open',
      statusHistory: [
        {
          status: 'open',
          changedAt: new Date().toISOString(),
          note: 'Ticket created',
        },
      ],
      attachments: [],
      resolvedAt: null,
      closedAt: null,
      startedAt: null,
      resolutionNotes: '',
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return response(formatDoc(snap));
  },

  async update(id, data) {
    const ref = doc(db, 'tickets', id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    const snap = await getDoc(ref);
    return response(formatDoc(snap));
  },

  /** Update status and append a status-history entry. */
  async updateStatus(id, status, note = '') {
    const ref = doc(db, 'tickets', id);
    const snap = await getDoc(ref);
    const ticket = formatDoc(snap);
    if (!ticket) throw new Error('Ticket not found');

    const historyEntry = { status, changedAt: new Date().toISOString(), note };
    const statusHistory = [...(ticket.statusHistory || []), historyEntry];

    const updateData = { status, statusHistory, updatedAt: serverTimestamp() };

    if (status === 'in_progress' && !ticket.startedAt) {
      updateData.startedAt = new Date().toISOString();
    }
    if (status === 'resolved') {
      updateData.resolvedAt = new Date().toISOString();
    }
    if (status === 'closed') {
      updateData.closedAt = new Date().toISOString();
    }

    await updateDoc(ref, updateData);
    const updated = await getDoc(ref);
    return response(formatDoc(updated));
  },

  /** Manually assign a technician and move status to 'assigned'. */
  async assignTechnician(id, technicianId) {
    const ref = doc(db, 'tickets', id);
    const snap = await getDoc(ref);
    const ticket = formatDoc(snap);
    if (!ticket) throw new Error('Ticket not found');

    const historyEntry = {
      status: 'assigned',
      changedAt: new Date().toISOString(),
      note: 'Technician manually assigned',
    };

    await updateDoc(ref, {
      assignedTechnician: technicianId,
      status: 'assigned',
      statusHistory: [...(ticket.statusHistory || []), historyEntry],
      updatedAt: serverTimestamp(),
    });

    // Increment technician's active ticket count
    try {
      const techRef = doc(db, 'technicians', technicianId);
      const techSnap = await getDoc(techRef);
      if (techSnap.exists()) {
        const current = techSnap.data().activeTicketCount || 0;
        await updateDoc(techRef, { activeTicketCount: current + 1, updatedAt: serverTimestamp() });
      }
    } catch (_) { /* non-fatal */ }

    const updated = await getDoc(ref);
    return response(formatDoc(updated));
  },

  /**
   * Auto-dispatch: find the available technician with the fewest active tickets
   * and assign them. Real business logic — no random pick.
   */
  async autoDispatch(id) {
    // Query available, active technicians
    const q = query(
      collection(db, 'technicians'),
      where('availability', '==', 'available'),
      where('isActive', '==', true)
    );
    const snap = await getDocs(q);
    const techs = formatCollection(snap);

    if (techs.length === 0) {
      throw new Error('No available technicians for auto-dispatch.');
    }

    // Pick least-loaded technician
    techs.sort((a, b) => (a.activeTicketCount || 0) - (b.activeTicketCount || 0));
    const best = techs[0];

    return this.assignTechnician(id, best._id);
  },

  async delete(id) {
    await deleteDoc(doc(db, 'tickets', id));
    return response({ id });
  },
};

export default ticketService;
