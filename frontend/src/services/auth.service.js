import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export const authService = {
  /**
   * Sign in with email + password.
   * Also fetches the Firestore user profile to get role, name, etc.
   */
  async login(email, password) {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const userDocSnap = await getDoc(doc(db, 'users', userCred.user.uid));

    if (!userDocSnap.exists()) {
      await signOut(auth);
      throw new Error('User profile not found. Please contact your administrator.');
    }

    const userData = userDocSnap.data();

    if (userData.isActive === false) {
      await signOut(auth);
      throw new Error('Your account has been deactivated. Please contact your administrator.');
    }

    const user = { _id: userCred.user.uid, ...userData };
    return { user, success: true };
  },

  /**
   * Returns the current user's Firestore profile, or null if not signed in.
   */
  async getCurrentUser() {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;
    const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!snap.exists()) return null;
    return { _id: firebaseUser.uid, ...snap.data() };
  },

  /**
   * Send a password-reset email via Firebase Auth.
   * actionCodeSettings points the email link back to our custom reset page.
   */
  async forgotPassword(email) {
    const actionCodeSettings = {
      // After reset the user is redirected to our app.
      // Update this URL once you know your Vercel domain.
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    return { data: { success: true, message: 'Password reset email sent. Check your inbox.' } };
  },

  /**
   * Confirm a password reset using the oobCode from the Firebase email link.
   * Used by ResetPasswordPage when Firebase is configured with a custom action URL.
   */
  async resetPassword(oobCode, newPassword) {
    await confirmPasswordReset(auth, oobCode, newPassword);
    return { data: { success: true, message: 'Password has been reset successfully.' } };
  },

  /**
   * Update name, phone, avatar in Firestore.
   * Email changes are intentionally blocked here (requires Firebase Auth re-auth flow).
   */
  async updateProfile(userId, profileData) {
    const ref = doc(db, 'users', userId);
    const updateData = {
      name: profileData.name ?? '',
      phone: profileData.phone ?? '',
      avatar: profileData.avatar ?? '',
      updatedAt: serverTimestamp(),
    };
    await updateDoc(ref, updateData);
    const snap = await getDoc(ref);
    return { _id: userId, ...snap.data() };
  },

  /** Sign the current user out. */
  async logout() {
    await signOut(auth);
  },
};

export default authService;
