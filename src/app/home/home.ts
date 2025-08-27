import {
  Component,
  ViewChild,
  computed,
  effect,
  signal,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectService, IProject } from '../services/project.service';
import { NewProjectDialog } from '../components/new-project-dialog/new-project-dialog';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    DatePipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {
  displayedColumns: string[] = ['name', 'status', 'created', 'lastModified'];
  dataSource = new MatTableDataSource<IProject>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Create local signals that mirror the service signals
  loading = signal<boolean>(false);
  private statusFilter = signal<string>('');

  currentStatusFilter = computed(() => this.statusFilter());

  private searchTerm = signal<{ name: string; status: string }>({
    name: '',
    status: '',
  });

  constructor(
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {
    // Set up effect for project data
    effect(() => {
      const projects = this.projectService.projects();
      this.dataSource.data = projects;
    });

    // Set up effects for loading and error states
    effect(() => {
      this.loading.set(this.projectService.loading());
    });
  }

  ngAfterViewInit() {
    // Initialize paginator and sort
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom filtering for project status
    this.dataSource.filterPredicate = (data: IProject, filter: string) => {
      const searchValue = JSON.parse(filter);
      if (!searchValue.name && !searchValue.status) {
        return true;
      }

      const filterName = searchValue.name;
      const filterStatus = searchValue.status;

      return (
        data.name.toLowerCase().includes(filterName) &&
        (filterStatus === '' || data.status.toLowerCase() === filterStatus)
      );
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm.update((term) => ({
      ...term,
      name: filterValue.toLowerCase(),
    }));
    this.dataSource.filter = JSON.stringify(this.searchTerm());

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByStatus(status: string) {
    const filterValue = status === 'all' ? '' : status;
    this.statusFilter.set(filterValue);
    this.searchTerm.update((term) => ({
      ...term,
      status: filterValue.toLowerCase(),
    }));
    this.dataSource.filter = JSON.stringify(this.searchTerm());

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openNewProjectDialog() {
    const dialogRef = this.dialog.open(NewProjectDialog, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.projectService.addProject({
            ...result,
            userId: this.authService.user()?.uid,
          });
          this.snackBar.open('Project created successfully', 'Close', {
            duration: 3000,
          });
        } catch (error) {
          this.snackBar.open('Failed to create project', 'Close', {
            duration: 5000,
          });
        }
      }
    });
  }
}
