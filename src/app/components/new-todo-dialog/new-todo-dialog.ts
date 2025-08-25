import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NewProjectDialog } from '../new-project-dialog/new-project-dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-todo-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './new-todo-dialog.html',
  styleUrl: './new-todo-dialog.scss',
})
export class NewTodoDialog {
  todoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewProjectDialog>,
  ) {
    this.todoForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.todoForm.valid) {
      const { name } = this.todoForm.value;
      this.dialogRef.close({
        name,
      });
    }
  }
}
