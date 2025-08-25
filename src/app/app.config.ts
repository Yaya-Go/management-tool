import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, connectAuthEmulator } from '@angular/fire/auth';
import {
  getFirestore,
  provideFirestore,
  connectFirestoreEmulator,
} from '@angular/fire/firestore';
import { LayoutModule } from '@angular/cdk/layout';

const firebaseConfig = {
  projectId: 'management-tool-b5b1d',
  appId: '1:588895742667:web:b21ea573ce22ef7c23894e',
  storageBucket: 'management-tool-b5b1d.firebasestorage.app',
  apiKey: 'AIzaSyCc_9JdE700bXKXnd8JeCexy1T-vxf8odk',
  authDomain: 'management-tool-b5b1d.firebaseapp.com',
  messagingSenderId: '588895742667',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => {
      const auth = getAuth();
      if (isDevMode()) {
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (isDevMode()) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    LayoutModule,
  ],
};
