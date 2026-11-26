import {
  db, collection, doc, getDoc, getDocs,
  query, orderBy, serverTimestamp, runTransaction,
  formatDoc, formatCollection, response, getNextSequence,
} from './api';

export const paymentService = {
  async getAll() {
    const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return response(formatCollection(snap));
  },

  async getById(id) {
    const snap = await getDoc(doc(db, 'payments', id));
    const data = formatDoc(snap);
    if (!data) throw new Error('Payment not found');
    return response(data);
  },

  /**
   * Record a payment in a Firestore transaction:
   *  1. Create the payment document.
   *  2. Update the linked invoice's amountPaid and status atomically.
   */
  async recordPayment(data) {
    const seq = await getNextSequence('payments');
    const paymentReference = `PAY-${String(seq).padStart(5, '0')}`;
    const payRef = doc(collection(db, 'payments'));

    await runTransaction(db, async (tx) => {
      // --- Payment document ---
      tx.set(payRef, {
        paymentReference,
        status: 'completed',
        currency: 'INR',
        paidAt: new Date().toISOString(),
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // --- Update the linked invoice ---
      const invoiceId = data.invoice || data.invoiceId;
      if (invoiceId) {
        const invRef = doc(db, 'invoices', invoiceId);
        const invSnap = await tx.get(invRef);

        if (invSnap.exists()) {
          const inv = invSnap.data();
          const newAmountPaid = (Number(inv.amountPaid) || 0) + Number(data.amount);
          const total = Number(inv.total) || 0;

          let newStatus = inv.status;
          if (newAmountPaid >= total) {
            newStatus = 'paid';
          } else if (newAmountPaid > 0) {
            newStatus = 'partially_paid';
          }

          tx.update(invRef, {
            amountPaid: newAmountPaid,
            status: newStatus,
            paidAt: newAmountPaid >= total ? new Date().toISOString() : inv.paidAt ?? null,
            updatedAt: serverTimestamp(),
          });
        }
      }
    });

    const snap = await getDoc(payRef);
    return response(formatDoc(snap));
  },
};

export default paymentService;
