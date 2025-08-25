import { Component, computed, effect, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { INote, NoteService } from '../../services/note.service';
import { IProject, ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NewNoteDialog } from '../new-note-dialog/new-note-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { SafeHtmlPipe } from '../../pipes/safeHtml.pipe';

@Component({
  selector: 'app-project-note',
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    SafeHtmlPipe,
  ],
  templateUrl: './project-note.html',
  styleUrl: './project-note.scss',
})
export class ProjectNote {
  project = computed(() => this.projectService.currentProject());
  notes = computed(() => this.noteService.notes());
  filteredNotes = signal<INote[]>([]);
  searchText = signal<string>('');

  constructor(
    private projectService: ProjectService,
    private noteService: NoteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    // Set up effect for search filtering
    effect(async () => {
      if (this.project()?.id) {
        await this.noteService.fetchNotes(this.project()?.id || '');
      }
    });

    effect(() => {
      this.filterNote();
    });
  }

  filterNote() {
    const term = this.searchText().toLowerCase();
    const notes = this.notes();

    if (!term) {
      this.filteredNotes.set(notes);
      return;
    }

    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(term) ||
        note.text.toLowerCase().includes(term),
    );
    this.filteredNotes.set(filtered);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
  }

  async addNote() {
    const dialogRef = this.dialog.open(NewNoteDialog, {
      width: '640px',
      disableClose: true,
      data: { note: { title: '', text: '' } as INote },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.title?.trim()) {
        try {
          await this.noteService.addNote(
            { title: result.title.trim(), text: result.text } as INote,
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

  async editNote(note: INote) {
    const dialogRef = this.dialog.open(NewNoteDialog, {
      width: '640px',
      disableClose: true,
      data: { note },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.title?.trim()) {
        try {
          await this.noteService.updateNote({
            ...note,
            title: result.title.trim(),
            text: result.text,
            lastModified: new Date(),
          } as INote);
        } catch (error) {
          this.snackBar.open('Failed to update todo item', 'Close', {
            duration: 5000,
          });
        }
      }
    });
  }

  async deleteNote(note: INote) {
    if (!note.id) return;

    if (
      confirm(
        `Are you sure you want to delete the note "${note.title}"? This action cannot be undone.`,
      )
    ) {
      try {
        await this.noteService.deleteNote(note.id);
      } catch (error) {
        this.snackBar.open('Failed to delete todo item', 'Close', {
          duration: 5000,
        });
      }
    }
  }
}
