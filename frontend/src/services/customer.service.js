import {
  db, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp,
  formatDoc, formatCollection, response, getNextSequence,
} from './api';

export const customerService = {
  async getAll() {
    const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return response(formatCollection(snap));
  },

  async getById(id) {
    const snap = await getDoc(doc(db, 'customers', id));
    const data = formatDoc(snap);
    if (!data) throw new Error('Customer not found');
    return response(data);
  },

  async create(data) {
    const seq = await getNextSequence('customers');
    const customerCode = `CUST-${String(seq).padStart(5, '0')}`;
    const docRef = await addDoc(collection(db, 'customers'), {
      customerCode,
      isActive: true,
      serviceAddresses: [],
      tags: [],
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return response(formatDoc(snap));
  },

  async update(id, data) {
    const ref = doc(db, 'customers', id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    const snap = await getDoc(ref);
    return response(formatDoc(snap));
  },

  async delete(id) {
    // Soft-delete: mark inactive rather than hard-deleting linked data
    const ref = doc(db, 'customers', id);
    await updateDoc(ref, { isActive: false, updatedAt: serverTimestamp() });
    return response({ id });
  },
};

export default customerService;
