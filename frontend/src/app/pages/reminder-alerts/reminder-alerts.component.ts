import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReminderService } from '../../services/reminder.service';

@Component({
  selector: 'app-reminder-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reminder-alerts.component.html',
  styleUrls: ['./reminder-alerts.component.css']
})
export class ReminderAlertsComponent implements OnInit {
  reminders: any[] = [];
  loading = false;
  showForm = false;
  newReminder = { projectName: '', clientName: '', note: '' };

  constructor(private reminderService: ReminderService) {}

  ngOnInit() { this.loadReminders(); }

  loadReminders() {
    this.loading = true;
    this.reminderService.getReminders().subscribe({
      next: res => { this.reminders = res || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  addReminder() {
    if (!this.newReminder.projectName) return;
    this.reminderService.createReminder(this.newReminder).subscribe({
      next: (res) => {
        this.reminders = [res, ...this.reminders];
        this.newReminder = { projectName: '', clientName: '', note: '' };
        this.showForm = false;
      },
      error: (err) => console.error(err)
    });
  }

  deleteReminder(id: string) {
    this.reminderService.deleteReminder(id).subscribe({
      next: () => this.reminders = this.reminders.filter(r => r._id !== id),
      error: (err) => console.error(err)
    });
  }

  getBadgeClass(type: string): string {
    if (['DOMAIN_EXPIRED', 'HOSTING_EXPIRED'].includes(type)) return 'badge-expired';
    if (['DOMAIN_EXPIRING', 'HOSTING_EXPIRING'].includes(type)) return 'badge-soon';
    if (type === 'PAYMENT_PENDING') return 'badge-pending';
    return 'badge-manual';
  }

  formatType(type: string): string { return type?.replace(/_/g, ' ') ?? ''; }
}