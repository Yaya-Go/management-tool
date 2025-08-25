import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { ProjectService } from './services/project.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'project/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
