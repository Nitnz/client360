import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
   showAddForm = false; 

  clients: any[] = [];
  loading = false;
  

  // ✅ Add form
  newClient = {
    name: '',
    companyName: '',
    email: '',
    phone: ''
  };

  // ✅ Edit state
  editingId: string | null = null;
  editClient: any = {};

  // ✅ Projects under selected client
  expandedClientId: string | null = null;
  clientProjects: any[] = [];
  projectsLoading = false;

  constructor(
    private clientService: ClientService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

loadClients() {
  this.loading = true;
  console.log('loadClients called');  // ← add
  this.clientService.getClients().subscribe({
    next: (res) => {
      console.log('response:', res, 'loading set to false');  // ← add
      this.clients = res;
      this.loading = false;
    },
    error: (err) => {
      console.error('error:', err);
      this.loading = false;
    }
  });
}

  // ✅ Create
  addClient() {
    if (!this.newClient.name || !this.newClient.email) return;

    this.clientService.createClient(this.newClient).subscribe({
      next: () => {
        this.newClient = { name: '', companyName: '', email: '', phone: '' };
        this.loadClients();
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ Edit Start
  startEdit(client: any) {
    this.editingId = client._id;
    this.editClient = { ...client };
  }

  cancelEdit() {
    this.editingId = null;
    this.editClient = {};
  }

  // ✅ Update
  saveEdit() {
    if (!this.editingId) return;

    this.clientService.updateClient(this.editingId, this.editClient).subscribe({
      next: () => {
        this.editingId = null;
        this.editClient = {};
        this.loadClients();
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ Delete
deleteClient(id: string) {
  if (!confirm('Delete this client?')) return;
  this.clientService.deleteClient(id).subscribe({
    next: () => {
      this.clients = this.clients.filter(c => c._id !== id);  // ← remove instantly
    },
    error: (err) => {
      const msg = err.error?.message || 'Cannot delete client.';
      alert('⚠️ ' + msg);
    }
  });
}

  // ✅ Toggle projects under a client
  toggleProjects(clientId: string) {
    if (this.expandedClientId === clientId) {
      this.expandedClientId = null;
      this.clientProjects = [];
      return;
    }

    this.expandedClientId = clientId;
    this.projectsLoading = true;

    this.projectService.getProjectsByClient(clientId).subscribe({
      next: (res) => {
        this.clientProjects = res;
        this.projectsLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.projectsLoading = false;
      }
    });
  }
}