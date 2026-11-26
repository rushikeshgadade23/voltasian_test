/**
 * api.js — Firebase / Firestore utility helpers.
 * All service files import their Firestore functions from here
 * to keep imports centralised and consistent.
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Re-export Firestore primitives so services only need one import
export {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  runTransaction,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively convert Firestore Timestamp objects to ISO strings. */
function convertTimestamps(value) {
  if (value === null || value === undefined) return value;
  if (value && typeof value.toDate === 'function') return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(convertTimestamps);
  if (typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = convertTimestamps(v);
    }
    return out;
  }
  return value;
}

/** Convert a Firestore DocumentSnapshot to a plain JS object with `_id`. */
export function formatDoc(snap) {
  if (!snap || !snap.exists()) return null;
  return { _id: snap.id, ...convertTimestamps(snap.data()) };
}

/** Convert a Firestore QuerySnapshot to an array of plain JS objects. */
export function formatCollection(snap) {
  return snap.docs.map(formatDoc);
}

/** Wrap data in the shape the existing frontend expects: { data: { success, data } } */
export function response(data) {
  return { data: { success: true, data } };
}

/**
 * Get the next auto-incrementing sequence number for a given type
 * (e.g. 'tickets', 'invoices'). Uses a Firestore transaction on a
 * top-level `counters` collection so it is atomic and race-free.
 */
export async function getNextSequence(type) {
  const counterRef = doc(db, 'counters', type);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? snap.data().current : 0;
    const next = current + 1;
    tx.set(counterRef, { current: next });
    return next;
  });
}
