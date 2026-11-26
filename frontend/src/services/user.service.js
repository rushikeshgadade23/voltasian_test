import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  db, collection, doc, getDoc, getDocs, setDoc, updateDoc,
  query, orderBy, serverTimestamp,
  formatDoc, formatCollection, response,
} from './api';
import { secondaryAuth, auth } from '../lib/firebase';

/** Generate a temporary strong password for newly created accounts. */
function generateTempPassword() {
  return 'Tmp@' + Math.random().toString(36).slice(2, 10) + '!9';
}

export const userService = {
  async getAll() {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return response(formatCollection(snap));
  },

  async getById(id) {
    const snap = await getDoc(doc(db, 'users', id));
    const data = formatDoc(snap);
    if (!data) throw new Error('User not found');
    return response(data);
  },

  /**
   * Admin creates a new Firebase Auth user WITHOUT signing out the current admin.
   * Uses a secondary Firebase app instance so both sessions stay independent.
   * After creating the Auth account, it immediately signs the secondary session out
   * and writes the user profile to Firestore.
   * If no password is supplied, a temporary one is generated and a reset email is sent.
   */
  async create(data) {
    const { email, password, name, role, phone, avatar } = data;
    const tempPassword = password || generateTempPassword();

    // 1. Create the Firebase Auth account via the secondary app instance
    const userCred = await createUserWithEmailAndPassword(secondaryAuth, email, tempPassword);
    const uid = userCred.user.uid;

    // 2. Immediately sign out the secondary session
    await firebaseSignOut(secondaryAuth);

    // 3. Write the Firestore profile document (doc ID = Firebase Auth UID)
    const userRef = doc(db, 'users', uid);
    const userData = {
      name: name || '',
      email,
      role: role || 'customer',
      phone: phone || '',
      avatar: avatar || '',
      isActive: true,
      isEmailVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(userRef, userData);

    // 4. If admin didn't supply a password, send a reset email so user can set their own
    if (!password) {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (e) {
        console.warn('Could not send password reset email:', e.message);
      }
    }

    const snap = await getDoc(userRef);
    return response(formatDoc(snap));
  },

  async update(id, data) {
    const ref = doc(db, 'users', id);
    // Strip email – changing it requires Firebase Auth re-auth and is handled separately
    const { email, ...rest } = data;
    await updateDoc(ref, { ...rest, updatedAt: serverTimestamp() });
    const snap = await getDoc(ref);
    return response(formatDoc(snap));
  },

  /**
   * Soft-delete: mark isActive = false in Firestore.
   * Hard-deleting from Firebase Auth requires the Admin SDK (server-side only).
   */
  async delete(id) {
    const ref = doc(db, 'users', id);
    await updateDoc(ref, { isActive: false, updatedAt: serverTimestamp() });
    return response({ id });
  },
};

export default userService;
