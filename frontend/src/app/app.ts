import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from './services/project.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading">Loading projects...</div>

    <ul *ngIf="!loading && projects.length > 0">
      <li *ngFor="let project of projects">
        {{ project.name }}
      </li>
    </ul>

    <div *ngIf="!loading && projects.length === 0">
      No expiring projects
    </div>
  `
})
export class App implements OnInit {
  projects: any[] = []; // ✅ FIXED (was users)
  loading = true;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getExpiringProjects().subscribe({
      next: (res: { data: any[] }) => {
        this.projects = res.data || [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('HTTP error:', err);
        this.loading = false;
      }
    });
  }
}