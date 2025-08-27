import { Component, computed, effect, signal } from '@angular/core';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-tag-list',
  imports: [MatChipsModule, MatIconModule, MatInputModule],
  templateUrl: './tag-list.html',
  styleUrl: './tag-list.scss',
})
export class TagList {
  project = computed(() => this.projectService.currentProject());
  tags = signal<string[]>([]);

  constructor(private projectService: ProjectService) {
    effect(() => {
      this.tags.set(this.project()?.tags || []);
    });
  }

  async addTag(event: MatChipInputEvent) {
    if (!this.project()?.id || !event.value.trim()) return;

    this.tags.update((tags) => [...tags, event.value.trim()]);

    await this.projectService.updateProject(this.project()!.id!, {
      tags: this.tags(),
    });
    event.chipInput!.clear();
  }

  async removeTag(index: number) {
    if (!this.project()?.id) return;
    this.tags.update((tags) => tags.filter((tag, i) => i !== index));
    await this.projectService.updateProject(this.project()!.id!, {
      tags: this.tags(),
    });
  }
}
