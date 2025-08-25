import { Injectable, signal } from '@angular/core';
import { ResizeService } from './resize.service';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  isOpen = signal(true);

  constructor(private resize: ResizeService) {
    this.resize.isWeb$.subscribe((isWeb) => {
      if (isWeb) {
        this.isOpen.set(true);
      } else {
        this.isOpen.set(false);
      }
    });
  }

  toggleSidenav() {
    this.isOpen.update((open) => !open);
  }

  closeSidenav() {
    this.isOpen.set(false);
  }

  openSidenav() {
    this.isOpen.set(true);
  }
}
