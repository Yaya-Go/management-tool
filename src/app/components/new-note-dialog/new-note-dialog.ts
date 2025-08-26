import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NewProjectDialog } from '../new-project-dialog/new-project-dialog';
import { CommonModule } from '@angular/common';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor } from 'ngx-editor';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { INote } from '../../services/note.service';

@Component({
  selector: 'app-new-note-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEditorComponent,
    NgxEditorMenuComponent,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './new-note-dialog.html',
  styleUrl: './new-note-dialog.scss',
})
export class NewNoteDialog implements OnInit, OnDestroy {
  noteForm: FormGroup;
  editor: Editor;
  note = inject<INote>(MAT_DIALOG_DATA);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewProjectDialog>,
  ) {
    this.noteForm = this.fb.group({
      title: [this.note.title, Validators.required],
      text: [this.note.text],
    });
  }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onSubmit() {
    if (this.noteForm.valid) {
      const { title, text } = this.noteForm.value;
      this.dialogRef.close({
        title,
        text,
      });
    }
  }
}
