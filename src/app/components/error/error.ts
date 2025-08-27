import { Component, computed } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { ProjectService } from '../../services/project.service';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.html',
  styleUrl: './error.scss',
})
export class Error {
  readonly projectError = computed(() => this.projectService.error());
  readonly todoError = computed(() => this.todoService.error());
  readonly noteError = computed(() => this.noteService.error());

  constructor(
    private projectService: ProjectService,
    private todoService: TodoService,
    private noteService: NoteService,
  ) {}
}
