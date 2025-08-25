import { Injectable, computed, signal } from '@angular/core';
import {
  Auth,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly authState = signal<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Public signals for components to consume
  readonly user = computed(() => this.authState().user);
  readonly loading = computed(() => this.authState().loading);
  readonly error = computed(() => this.authState().error);
  readonly isAuthenticated = computed(() => !!this.user());

  constructor(
    private auth: Auth,
    private router: Router,
  ) {
    // Initialize auth state listener
    onAuthStateChanged(auth, (user) => {
      this.authState.update((state) => ({
        ...state,
        user,
        loading: false,
        error: null,
      }));

      if (!user) {
        // If user is not authenticated, redirect to sign-in page
        this.router.navigate(['/signin']);
      }
    });
  }

  private handleError(error: unknown) {
    console.error('Auth error:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An error occurred during authentication';
    this.authState.update((state) => ({
      ...state,
      error: errorMessage,
    }));
    throw error;
  }

  async login(email: string, password: string): Promise<void> {
    try {
      this.authState.update((state) => ({
        ...state,
        loading: true,
        error: null,
      }));
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/']);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.authState.update((state) => ({ ...state, loading: false }));
    }
  }

  async register(
    email: string,
    password: string,
    displayName: string,
  ): Promise<void> {
    try {
      this.authState.update((state) => ({
        ...state,
        loading: true,
        error: null,
      }));
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

      this.router.navigate(['/']);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.authState.update((state) => ({ ...state, loading: false }));
    }
  }

  async logout(): Promise<void> {
    try {
      this.authState.update((state) => ({
        ...state,
        loading: true,
        error: null,
      }));
      await signOut(this.auth);
      this.router.navigate(['/signin']);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.authState.update((state) => ({ ...state, loading: false }));
    }
  }

  clearError(): void {
    this.authState.update((state) => ({ ...state, error: null }));
  }
}
