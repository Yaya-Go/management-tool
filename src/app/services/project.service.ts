import { Injectable, signal } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp,
  where,
  getDoc,
} from '@angular/fire/firestore';

export type Status =
  | 'Draft'
  | 'To Do'
  | 'In Process'
  | 'Ready for Prod'
  | 'In Prod'
  | 'Done';

export interface IProject {
  id?: string;
  name: string;
  status: Status;
  created: Date;
  lastModified: Date;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly docName = 'projects';
  readonly projects = signal<IProject[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  currentProject = signal<IProject | null>(null);

  constructor(private firestore: Firestore) {}

  // Get all projects
  async fetchProjects(userId?: string) {
    try {
      this.loading.set(true);
      this.error.set(null);

      const projectsRef = collection(this.firestore, this.docName);
      const q = query(
        projectsRef,
        where('userId', '==', userId || ''),
        orderBy('lastModified', 'desc'),
      );
      const querySnapshot = await getDocs(q);

      const projects = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data['name'],
          status: data['status'],
          created: (data['created'] as Timestamp).toDate(),
          lastModified: (data['lastModified'] as Timestamp).toDate(),
          userId,
        } as IProject;
      });

      this.projects.set(projects);
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : 'Error fetching projects',
      );
    } finally {
      this.loading.set(false);
    }
  }

  // Add a new project
  async addProject(project: Omit<IProject, 'id' | 'created' | 'lastModified'>) {
    try {
      this.error.set(null);

      const projectsRef = collection(this.firestore, this.docName);
      const now = Timestamp.fromDate(new Date());

      // Create the project document with Firestore Timestamp
      const projectData = {
        name: project.name,
        status: project.status,
        created: now,
        lastModified: now,
        userId: project.userId,
      };

      const docRef = await addDoc(projectsRef, projectData);

      // Create the new project with JavaScript Date objects
      const newProject: IProject = {
        id: docRef.id,
        name: project.name,
        status: project.status,
        created: now.toDate(),
        lastModified: now.toDate(),
        userId: project.userId,
      };

      this.projects.update((projects) => [...projects, newProject]);

      return newProject;
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : 'Error adding project',
      );
      throw err;
    }
  }

  async fetchProjectById(projectId: string) {
    try {
      this.error.set(null);

      const projectRef = doc(this.firestore, this.docName, projectId);
      const docSnap = await getDoc(projectRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      const project: IProject = {
        id: docSnap.id,
        name: data['name'],
        status: data['status'],
        created: (data['created'] as Timestamp).toDate(),
        lastModified: (data['lastModified'] as Timestamp).toDate(),
        userId: data['userId'],
      };

      this.currentProject.set(project);

      return project;
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : 'Error fetching project',
      );
      throw err;
    }
  }

  // Update a project
  async updateProject(
    projectId: string,
    updates: Partial<Omit<IProject, 'id'>>,
  ) {
    try {
      this.error.set(null);

      const projectRef = doc(this.firestore, this.docName, projectId);
      await updateDoc(projectRef, {
        ...updates,
        lastModified: new Date(),
      });

      this.projects.update((projects) =>
        projects.map((project) => {
          if (project.id === projectId) {
            const newPro = { ...project, ...updates, lastModified: new Date() };
            this.currentProject.set(newPro);
            return newPro;
          } else {
            return project;
          }
        }),
      );
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : 'Error updating project',
      );
      throw err;
    }
  }

  // Delete a project
  async deleteProject(projectId: string) {
    try {
      this.error.set(null);

      const projectRef = doc(this.firestore, this.docName, projectId);
      await deleteDoc(projectRef);

      this.projects.update((projects) =>
        projects.filter((project) => project.id !== projectId),
      );
      this.currentProject.set(null);
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : 'Error deleting project',
      );
      throw err;
    }
  }
}
