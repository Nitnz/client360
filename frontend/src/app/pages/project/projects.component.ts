import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  showCreateForm = false;
  clients: any[] = [];
  projects: any[] = [];
  loading = false;
  editingId: string | null = null;
  editProject: any = {};
  newProject: any = this.emptyProject();

  constructor(private projectService: ProjectService, private clientService: ClientService) {}

  ngOnInit() {
    this.clientService.getClients().subscribe(res => this.clients = res);
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.projectService.getAllProjects().subscribe({
      next: res => { this.projects = [...res]; this.loading = false; },
      error: () => this.loading = false
    });
  }

  emptyProject() {
    return { client: '', projectName: '', cost: '', status: 'Pending', domainName: '', domainExpiry: '', hostingExpiry: '' };
  }

  buildPayload(p: any) {
    return {
      client: p.client?._id ?? p.client,
      projectName: p.projectName,
      cost: Number(p.cost),
      status: p.status,
      domainName: p.domainName,
      domainExpiry: p.domainExpiry ? new Date(p.domainExpiry) : null,
      hostingExpiry: p.hostingExpiry ? new Date(p.hostingExpiry) : null
    };
  }

  createProject() {
    if (!this.newProject.client || !this.newProject.projectName || !this.newProject.cost) return;
    this.projectService.createProject(this.buildPayload(this.newProject)).subscribe(() => {
      this.newProject = this.emptyProject();
      this.showCreateForm = false;
      this.loadProjects();
    });
  }

  startEdit(p: any) {
    this.editingId = p._id;
    this.editProject = {
      ...p,
      client: p.client?._id ?? p.client,
      domainExpiry: this.toInputDate(p.domainExpiry),
      hostingExpiry: this.toInputDate(p.hostingExpiry)
    };
  }

  cancelEdit() { this.editingId = null; this.editProject = {}; }

  saveEdit() {
    if (!this.editingId) return;
    this.projectService.updateProject(this.editingId, this.buildPayload(this.editProject)).subscribe({
      next: () => { this.cancelEdit(); this.loadProjects(); },
      error: (err) => console.error('Update failed:', err)
    });
  }

deleteProject(id: string) {
  if (!confirm('Delete this project?')) return;
  this.projectService.deleteProject(id).subscribe({
    next: () => {
      this.projects = this.projects.filter(p => p._id !== id);  // ← remove instantly
    },
    error: (err) => console.error('Delete failed:', err)
  });
}

  getExpiry(p: any): string {
    const today = new Date();
    const soon = new Date(); soon.setDate(today.getDate() + 7);
    const dates = [p.domainExpiry, p.hostingExpiry].filter(Boolean).map((d: any) => new Date(d));
    if (!dates.length) return 'No Expiry';
    if (dates.some(d => d < today)) return 'Expired';
    if (dates.some(d => d <= soon)) return 'Expiring Soon';
    return 'Active';
  }

  getStatusClass(value: string): string { return value?.toLowerCase().replace(/ /g, '-') ?? ''; }

  toInputDate(date: any): string { return date ? new Date(date).toISOString().slice(0, 10) : ''; }
}