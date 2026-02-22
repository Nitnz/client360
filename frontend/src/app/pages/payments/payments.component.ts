import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  projects: any[] = [];
  selectedProjectId = '';
  selectedProject: any = null;

  payments: any[] = [];

  summary = {
    projectCost: 0,
    totalPaid: 0,
    pendingAmount: 0
  };

  loading = false;
  message = '';
  error = '';

  newPayment = {
    amount: '',
    type: 'Advance',
    method: 'UPI',
    note: ''
  };

  constructor(
    private projectService: ProjectService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

loadProjects() {
  this.loading = true;
  this.projectService.getAllProjects().subscribe({
    next: (res: any) => {
      this.projects = res || [];
      this.loading = false;  // ✅ always runs
    },
    error: () => {
      this.error = 'Failed to load projects';
      this.loading = false;
    },
    complete: () => {
      this.loading = false;  // ✅ safety net
    }
  });
}

  onProjectChange() {
    this.message = '';
    this.error = '';
    this.payments = [];
    this.summary = { projectCost: 0, totalPaid: 0, pendingAmount: 0 };
    this.selectedProject = null;

    if (!this.selectedProjectId) return;

    this.selectedProject = this.projects.find(p => p._id === this.selectedProjectId);
    this.summary.projectCost = Number(this.selectedProject?.cost || 0);

    this.loading = true;
    this.paymentService.getPaymentsByProject(this.selectedProjectId).subscribe({
      next: (pays: any) => {
        this.payments = pays || [];
        this.recalculateSummary();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load payments';
        this.loading = false;
      }
    });
  }

  recalculateSummary() {
    const totalPaid = this.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    this.summary.totalPaid = totalPaid;
    this.summary.pendingAmount = Math.max(this.summary.projectCost - totalPaid, 0);
  }

  addPayment() {
    this.message = '';
    this.error = '';

    if (!this.selectedProjectId) {
      this.error = 'Please select a project first';
      return;
    }

    const amt = Number(this.newPayment.amount);
    if (!amt || amt <= 0) {
      this.error = 'Enter a valid amount';
      return;
    }

    const payload = {
      projectId: this.selectedProjectId,
      amount: amt,
      type: this.newPayment.type,
      method: this.newPayment.method,
      note: this.newPayment.note
    };

    this.loading = true;
    this.paymentService.createPayment(payload).subscribe({
      next: (newPayment) => {
        this.message = 'Payment added successfully ✅';
        this.newPayment = { amount: '', type: 'Advance', method: 'UPI', note: '' };
        this.payments.unshift(newPayment);
        this.recalculateSummary();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to add payment';
        this.loading = false;
      }
    });
  } // ← this was missing

  deletePayment(paymentId: string) {
    if (!paymentId) return;
    if (!confirm('Delete this payment?')) return;

    this.loading = true;
    this.paymentService.deletePayment(paymentId).subscribe({
      next: () => {
        this.message = 'Payment deleted ✅';
        // ✅ Immediately remove from array without refetch
        this.payments = this.payments.filter(p => p._id !== paymentId);
        this.recalculateSummary();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to delete payment';
        this.loading = false;
      }
    });
  }

  formatDate(d: any) {
    if (!d) return '-';
    return new Date(d).toLocaleString();
  }
}