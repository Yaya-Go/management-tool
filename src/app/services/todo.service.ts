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

export interface ITodo {
  id?: string;
  name: string;
  status: 'To Do' | 'Done';
  created: Date;
  lastModified: Date;
  projectId: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly docName = 'todos';
  readonly list = signal<ITodo[]>([]);
  readonly error = signal<string | null>(null);
  readonly loading = signal<boolean>(true);

  constructor(private firestore: Firestore) {}

  async fetchTodos(projectId: string) {
    if (!projectId) return;

    try {
      this.loading.set(true);
      this.error.set(null);
      const todosRef = collection(this.firestore, this.docName);
      const q = query(todosRef, where('projectId', '==', projectId));
      const querySnapshot = await getDocs(q);

      const todos = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data['name'],
          status: data['status'],
          created: (data['created'] as Timestamp).toDate(),
          lastModified: (data['lastModified'] as Timestamp).toDate(),
          projectId: data['projectId'],
        } as ITodo;
      });

      this.list.set(todos);
    } catch (error) {
      this.error.set('Failed to fetch todos');
    } finally {
      this.loading.set(false);
    }
  }

  async addTodo(name: string, projectId: string) {
    try {
      this.loading.set(true);
      this.error.set(null);

      const todosRef = collection(this.firestore, this.docName);
      const newTodo = {
        name,
        status: 'To Do' as const,
        projectId,
        created: new Date(),
        lastModified: new Date(),
      };
      const docRef = await addDoc(todosRef, newTodo);

      this.list.update((todos) => [...todos, { ...newTodo, id: docRef.id }]);
    } catch (error) {
      this.error.set('Failed to add todo');
    } finally {
      this.loading.set(false);
    }
  }

  async updateTodo(todoId: string, updates: Partial<Omit<ITodo, 'id'>>) {
    if (!todoId) return;

    try {
      this.loading.set(true);
      this.error.set(null);

      const todosRef = doc(this.firestore, this.docName, todoId);

      await updateDoc(todosRef, {
        ...updates,
        lastModified: new Date(),
      });

      this.list.update((todos) =>
        todos.map((t) => (t.id === todoId ? { ...t, ...updates } : t)),
      );
    } catch (error) {
      this.error.set('Failed to update todo');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteTodo(todoId: string) {
    if (!todoId) return;

    try {
      this.loading.set(true);
      this.error.set(null);

      const todosRef = doc(this.firestore, this.docName, todoId);
      await deleteDoc(todosRef);

      this.list.update((todos) => todos.filter((t) => t.id !== todoId));
    } catch (error) {
      this.error.set('Failed to delete todo');
    } finally {
      this.loading.set(false);
    }
  }
}
