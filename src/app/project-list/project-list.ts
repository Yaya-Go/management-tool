import { Component, OnInit, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IProject, ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  projects = computed(() => this.projectService.projects());
  filteredProjects = signal<IProject[]>([]);
  searchTerm = signal<string>('');

  constructor(private projectService: ProjectService) {
    // Set up effect for search filtering
    effect(() => {
      this.filterProjects();
    });
  }

  filterProjects() {
    const term = this.searchTerm().toLowerCase();
    const projects = this.projects();

    if (!term) {
      this.filteredProjects.set(projects);
      return;
    }

    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(term),
    );
    this.filteredProjects.set(filtered);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
