import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { Status } from '../../services/project.service';

@Component({
  selector: 'app-new-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './new-project-dialog.html',
  styleUrl: './new-project-dialog.scss',
})
export class NewProjectDialog {
  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewProjectDialog>,
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      status: ['Draft', Validators.required],
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const { name, status } = this.projectForm.value;
      this.dialogRef.close({
        name,
        status: status as Status,
      });
    }
  }
}
