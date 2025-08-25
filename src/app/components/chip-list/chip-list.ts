import { Component, computed, effect, Input, OnInit } from '@angular/core';
import { ChipService, IChip } from '../../services/chip.service';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-chip-list',
  imports: [MatChipsModule, MatIconModule, MatInputModule],
  templateUrl: './chip-list.html',
  styleUrl: './chip-list.scss',
})
export class ChipList {
  project = computed(() => this.projectService.currentProject());
  chips = computed(() => this.chipService.chips());

  constructor(
    private projectService: ProjectService,
    private chipService: ChipService,
  ) {
    effect(() => {
      if (this.project()?.id) {
        this.chipService.fetchChips(this.project()?.id || '');
      }
    });
  }

  async addChip(event: MatChipInputEvent) {
    if (!this.project()?.id || !event.value.trim()) return;

    const newChip: IChip = {
      name: event.value.trim(),
      created: new Date(),
      lastModified: new Date(),
      projectId: this.project()?.id || '',
    };

    await this.chipService.addChip(newChip);
    event.chipInput!.clear();
  }

  async removeChip(chip: IChip) {
    if (!chip.id) return;
    await this.chipService.deleteChip(chip.id);
  }
}
