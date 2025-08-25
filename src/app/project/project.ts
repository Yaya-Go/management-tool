import { Component, computed } from '@angular/core';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { SidenavService } from '../services/sidenav.service';
import { ProjectService } from '../services/project.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectDetail } from '../project-detail/project-detail';
import { ProjectList } from '../project-list/project-list';
import { ResizeService } from '../services/resize.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    MatSidenavModule,
    ProjectList,
    ProjectDetail,
    MatProgressSpinnerModule,
  ],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {
  sidenavOpen = computed(() => this.sidenav.isOpen());
  loading = computed(() => this.projectService.loading());
  mode = 'side' as MatDrawerMode;

  constructor(
    private sidenav: SidenavService,
    private projectService: ProjectService,
    private resize: ResizeService,
  ) {
    this.resize.isWeb$.subscribe((isWeb) => {
      if (isWeb) {
        this.mode = 'side';
      } else {
        this.mode = 'over';
      }
    });
  }
}
