import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-expiry-alerts',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './expiry-alerts.component.html',
  styleUrls: ['./expiry-alerts.component.css'],
  providers: [DatePipe]
})
export class ExpiryAlertsComponent implements OnInit {

  projects: any[] = [];
  loading = false;
  daysWindow = 7;

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadExpiringProjects();
  }

  loadExpiringProjects() {
    this.loading = true;

    this.projectService.getExpiringProjects(this.daysWindow).subscribe({
      next: (res) => {
        this.projects = res.data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Expired': return 'badge-expired';
      case 'Expiring Soon': return 'badge-soon';
      default: return 'badge-active';
    }
  }
}