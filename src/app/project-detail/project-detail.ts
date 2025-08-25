import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProjectCard } from '../components/project-card/project-card';
import { ProjectNote } from '../components/project-note/project-note';
import { TodoList } from '../components/todo-list/todo-list';
import { Status, ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, RouterModule, ProjectCard, TodoList, ProjectNote],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail implements OnInit {
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
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/home']);
        return;
      }

      // Ensure projects are loaded
      await this.projectService.fetchProjectById(id);
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
