import {
  db, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp,
  formatDoc, formatCollection, response, getNextSequence,
} from './api';

export const installationService = {
  async getAll() {
    const q = query(collection(db, 'installations'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return response(formatCollection(snap));
  },

  async getById(id) {
    const snap = await getDoc(doc(db, 'installations', id));
    const data = formatDoc(snap);
    if (!data) throw new Error('Installation not found');
    return response(data);
  },

  async create(data) {
    const seq = await getNextSequence('installations');
    const installationNumber = `INST-${String(seq).padStart(4, '0')}`;

    const defaultChecklist = [
      { label: 'Unpack & Inspect Housing Integrity', isCompleted: false },
      { label: 'Mount Bracket on Structural Load Wall', isCompleted: false },
      { label: 'DC Isolator & Surge Protection Wiring', isCompleted: false },
      { label: 'Grid Interconnect AC Breaker Termination', isCompleted: false },
      { label: 'Firmware Update & IoT Gateway Sync', isCompleted: false },
      { label: 'Final Safety & Earthing Resistance Test (< 2 Ohms)', isCompleted: false },
    ];

    const docRef = await addDoc(collection(db, 'installations'), {
      installationNumber,
      status: 'scheduled',
      checklistItems: defaultChecklist,
      photos: [],
      signOff: { customerSignatureUrl: '', signedAt: null, signedByName: '' },
      notes: '',
      ...data,
      // override checklist if caller supplied one
      checklistItems: data.checklistItems || defaultChecklist,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return response(formatDoc(snap));
  },

  async update(id, data) {
    const ref = doc(db, 'installations', id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    const snap = await getDoc(ref);
    return response(formatDoc(snap));
  },

  /** Toggle a single checklist item and auto-complete the installation if all done. */
  async toggleChecklistItem(id, index, isCompleted) {
    const ref = doc(db, 'installations', id);
    const snap = await getDoc(ref);
    const inst = formatDoc(snap);
    if (!inst) throw new Error('Installation not found');

    const checklistItems = [...(inst.checklistItems || [])];
    if (!checklistItems[index]) throw new Error('Checklist item not found');
    checklistItems[index] = { ...checklistItems[index], isCompleted };

    const allDone = checklistItems.every((item) => item.isCompleted);
    const updateData = {
      checklistItems,
      updatedAt: serverTimestamp(),
      ...(allDone ? { status: 'completed' } : {}),
    };

    await updateDoc(ref, updateData);
    const updated = await getDoc(ref);
    return response(formatDoc(updated));
  },

  async delete(id) {
    await deleteDoc(doc(db, 'installations', id));
    return response({ id });
  },
};

export default installationService;
