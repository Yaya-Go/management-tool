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

export interface IChip {
  id?: string;
  name: string;
  created: Date;
  lastModified: Date;
  projectId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChipService {
  private readonly docName = 'chips';
  readonly chips = signal<IChip[]>([]);
  readonly error = signal<string | null>(null);

  constructor(private firestore: Firestore) {}

  async fetchChips(projectId: string) {
    if (!projectId) return;

    try {
      this.error.set(null);
      const chipsRef = collection(this.firestore, this.docName);
      const q = query(chipsRef, where('projectId', '==', projectId));
      const querySnapshot = await getDocs(q);

      const chips = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data['name'],
          created: (data['created'] as Timestamp).toDate(),
          lastModified: (data['lastModified'] as Timestamp).toDate(),
          projectId: data['projectId'],
        } as IChip;
      });

      this.chips.set(chips);
    } catch (error) {
      this.error.set('Failed to fetch chips');
    }
  }

  async addChip(chip: IChip) {
    try {
      const chipsRef = collection(this.firestore, this.docName);
      const newChip = {
        ...chip,
        created: new Date(),
        lastModified: new Date(),
      };
      const docRef = await addDoc(chipsRef, newChip);
      this.chips.update((chips) => [...chips, { ...newChip, id: docRef.id }]);
    } catch (error) {
      this.error.set('Failed to add chip');
    }
  }

  async updateChip(chipId: string, updates: Partial<IChip>) {
    try {
      const chipRef = doc(this.firestore, this.docName, chipId);
      await updateDoc(chipRef, {
        ...updates,
        lastModified: new Date(),
      });
      this.chips.update((chips) =>
        chips.map((chip) =>
          chip.id === chipId ? { ...chip, ...updates } : chip,
        ),
      );
    } catch (error) {
      this.error.set('Failed to update chip');
    }
  }

  async deleteChip(chipId: string) {
    try {
      const chipRef = doc(this.firestore, this.docName, chipId);
      await deleteDoc(chipRef);
      this.chips.update((chips) => chips.filter((chip) => chip.id !== chipId));
    } catch (error) {
      this.error.set('Failed to delete chip');
    }
  }
}
