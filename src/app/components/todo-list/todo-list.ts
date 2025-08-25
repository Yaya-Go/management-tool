import { Component, computed, effect } from '@angular/core';
import { ITodo, TodoService } from '../../services/todo.service';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectService } from '../../services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTodoDialog } from '../new-todo-dialog/new-todo-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {
  project = computed(() => this.projectService.currentProject());
  list = computed(() => this.todoService.list());

  constructor(
    private projectService: ProjectService,
    private todoService: TodoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    effect(() => {
      const projectId = this.project()?.id;
      if (projectId) {
        this.todoService.fetchTodos(projectId);
      }
    });
  }

  async addTodo() {
    const dialogRef = this.dialog.open(NewTodoDialog, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.name?.trim()) {
        try {
          await this.todoService.addTodo(
            result.name.trim(),
            this.project()?.id || '',
          );
        } catch (error) {
          this.snackBar.open('Failed to create todo item', 'Close', {
            duration: 5000,
          });
        }
      }
    });
  }

  async updateStatus(todo: ITodo) {
    const status = todo.status === 'To Do' ? 'Done' : 'To Do';
    await this.todoService.updateTodo(todo.id!, { status });
  }

  async deleteTodo(todo: ITodo) {
    if (confirm(`Are you sure you want to delete "${todo.name}"?`)) {
      await this.todoService.deleteTodo(todo.id!);
    }
  }
}
