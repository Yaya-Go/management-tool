import { Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';
import { ProjectService } from './services/project.service';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('management-tool');

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
  ) {
    // Initialization logic can go here if needed
    // For example, you could set up global services or state management

    effect(() => {
      if (this.authService.user()) {
        this.projectService
          .fetchProjects(this.authService.user()?.uid)
          .catch((error) => {
            this.snackBar.open('Error loading projects', 'Close', {
              duration: 5000,
            });
          });
      }
    });
  }
}
