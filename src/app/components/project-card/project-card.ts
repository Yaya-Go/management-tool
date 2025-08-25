import { Component, computed } from '@angular/core';
import {
  Status,
  ProjectService,
  IProject,
} from '../../services/project.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChipList } from '../chip-list/chip-list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-project-card',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    FormsModule,
    ChipList,
    MatMenuModule,
  ],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  project = computed(() => this.projectService.currentProject());

  statuses: Status[] = [
    'Draft',
    'To Do',
    'In Process',
    'Ready for Prod',
    'In Prod',
    'Done',
  ];

  constructor(
    private projectService: ProjectService,
    private router: Router,
  ) {}

  async updateStatus(newStatus: Status) {
    const currentProject = this.project();
    if (!currentProject?.id) return;

    const updatedProject: IProject = {
      ...currentProject,
      status: newStatus,
      lastModified: new Date(),
    };

    await this.projectService.updateProject(currentProject.id, updatedProject);
  }

  async deleteProject() {
    const isDelete = confirm(
      `Are you sure you want to delete the project "${this.project()?.name}"?`,
    );
    if (!isDelete) return;

    const currentProject = this.project();
    if (!currentProject?.id) return;
    await this.projectService.deleteProject(currentProject.id);
    this.router.navigate(['/home']);
  }
}
