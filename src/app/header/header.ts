import { Component, computed, effect, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { SidenavService } from '../services/sidenav.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    RouterLink,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  readonly currentUser = computed(() => this.authService.user());
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());

  showMenu: boolean = true;

  constructor(
    private authService: AuthService,
    private sidenav: SidenavService,
    private router: Router,
  ) {
    effect(() => {
      this.showMenu = this.router.url !== '/home' && this.isAuthenticated();
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showMenu =
          event.urlAfterRedirects !== '/home' && this.isAuthenticated();
      });
  }

  logout(): void {
    this.authService.logout().catch((error) => {
      console.error('Error signing out:', error);
    });
  }

  toggleSidenav(): void {
    this.sidenav.toggleSidenav();
  }
}
