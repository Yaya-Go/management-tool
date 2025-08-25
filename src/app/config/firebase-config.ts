import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { isDevMode } from '@angular/core';

const firebaseConfig = {
  // Your Firebase config here
  // This will be replaced with your actual config from Firebase Console
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id',
};

export function initializeFirebase() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  if (isDevMode()) {
    // Connect to emulators in development mode
    connectAuthEmulator(auth, 'http://localhost:9099', {
      disableWarnings: true,
    });
    connectFirestoreEmulator(firestore, 'localhost', 8080);

    console.log('Connected to Firebase emulators');
  }

  return { app, auth, firestore };
}
