import { getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

class FirebaseInit {
  static app = null;
  static auth = null;
  static db = null;
  static initialized = false;

  static initialize() {
    if (this.initialized) {
      return {
        app: this.app,
        auth: this.auth,
        db: this.db
      };
    }

    try {
      // Check if Firebase is already initialized
      if (getApps().length > 0) {
        this.app = getApp();
      } else {
        // This should not happen if firebaseConfig is imported first
        throw new Error('Firebase not initialized. Import firebaseConfig first.');
      }

      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.initialized = true;

      return {
        app: this.app,
        auth: this.auth,
        db: this.db
      };
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw error;
    }
  }

  static getApp() {
    if (!this.initialized) {
      this.initialize();
    }
    return this.app;
  }

  static getAuth() {
    if (!this.initialized) {
      this.initialize();
    }
    return this.auth;
  }

  static getDB() {
    if (!this.initialized) {
      this.initialize();
    }
    return this.db;
  }
}

export default FirebaseInit;