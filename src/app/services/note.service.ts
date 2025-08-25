import { Injectable, signal } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';

export interface INote {
  id?: string;
  title: string;
  text: string;
  created: Date;
  lastModified: Date;
  projectId: string;
}

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private readonly docName = 'notes';
  readonly notes = signal<INote[]>([]);
  readonly error = signal<string | null>(null);
  readonly loading = signal<boolean>(true);

  constructor(private firestore: Firestore) {}

  async fetchNotes(projectId: string) {
    if (!projectId) return;

    try {
      this.loading.set(true);
      this.error.set(null);
      const notesRef = collection(this.firestore, this.docName);
      const q = query(notesRef, where('projectId', '==', projectId));
      const querySnapshot = await getDocs(q);

      const notes = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data['title'],
          text: data['text'],
          created: (data['created'] as Timestamp).toDate(),
          lastModified: (data['lastModified'] as Timestamp).toDate(),
          projectId: data['projectId'],
        } as INote;
      });

      this.notes.set(notes);
    } catch (error) {
      this.error.set('Failed to fetch notes');
    } finally {
      this.loading.set(false);
    }
  }

  async addNote(note: INote, projectId: string) {
    if (!note.title.trim() || !projectId) return;

    const newNote: INote = {
      title: note.title.trim(),
      text: note.text || '',
      created: new Date(),
      lastModified: new Date(),
      projectId,
    };

    try {
      this.loading.set(true);
      this.error.set(null);
      const notesRef = collection(this.firestore, this.docName);
      const docRef = await addDoc(notesRef, newNote);
      this.notes.update((currentNotes) => [
        ...currentNotes,
        { ...newNote, id: docRef.id },
      ]);
    } catch (error) {
      this.error.set('Failed to add note');
    } finally {
      this.loading.set(false);
    }
  }

  async updateNote(note: INote) {
    if (!note.id || !note.projectId || !note.title.trim()) return;

    try {
      this.loading.set(true);
      this.error.set(null);
      const noteRef = doc(this.firestore, this.docName, note.id);
      await updateDoc(noteRef, {
        title: note.title.trim(),
        text: note.text || '',
        lastModified: new Date(),
      });
      this.notes.update((currentNotes) =>
        currentNotes.map((n) => (n.id === note.id ? { ...n, ...note } : n)),
      );
    } catch (error) {
      this.error.set('Failed to update note');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteNote(noteId: string) {
    if (!noteId) return;

    try {
      this.loading.set(true);
      this.error.set(null);
      const noteRef = doc(this.firestore, this.docName, noteId);
      await deleteDoc(noteRef);
      this.notes.update((currentNotes) =>
        currentNotes.filter((n) => n.id !== noteId),
      );
    } catch (error) {
      this.error.set('Failed to delete note');
    } finally {
      this.loading.set(false);
    }
  }
}
