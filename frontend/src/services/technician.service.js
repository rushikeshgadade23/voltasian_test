import {
  db, collection, doc, getDoc, getDocs, addDoc, updateDoc,
  query, orderBy, serverTimestamp,
  formatDoc, formatCollection, response, getNextSequence,
} from './api';

export const technicianService = {
  async getAll() {
    const q = query(collection(db, 'technicians'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return response(formatCollection(snap));
  },

  async getById(id) {
    const snap = await getDoc(doc(db, 'technicians', id));
    const data = formatDoc(snap);
    if (!data) throw new Error('Technician not found');
    return response(data);
  },

  async create(data) {
    const seq = await getNextSequence('technicians');
    const employeeCode = `TECH-${String(seq).padStart(3, '0')}`;
    const docRef = await addDoc(collection(db, 'technicians'), {
      employeeCode,
      availability: 'available',
      rating: { average: 5.0, count: 0 },
      activeTicketCount: 0,
      maxConcurrentTickets: 5,
      isActive: true,
      skills: [],
      certifications: [],
      serviceRegions: [],
      workingHours: { start: '09:00', end: '18:00' },
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return response(formatDoc(snap));
  },

  async update(id, data) {
    const ref = doc(db, 'technicians', id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    const snap = await getDoc(ref);
    return response(formatDoc(snap));
  },

  async toggleAvailability(id, availability) {
    const ref = doc(db, 'technicians', id);
    await updateDoc(ref, { availability, updatedAt: serverTimestamp() });
    const snap = await getDoc(ref);
    return response(formatDoc(snap));
  },

  async delete(id) {
    // Soft-delete: preserve historical ticket/installation references
    const ref = doc(db, 'technicians', id);
    await updateDoc(ref, { isActive: false, updatedAt: serverTimestamp() });
    return response({ id });
  },
};

export default technicianService;
