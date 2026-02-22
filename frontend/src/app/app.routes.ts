import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ExpiryAlertsComponent } from './pages/expiry-alerts/expiry-alerts.component';
import { NotesComponent } from './pages/notes/notes.component';
import { ReminderAlertsComponent } from './pages/reminder-alerts/reminder-alerts.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { ClientsComponent } from './pages/client/clients.component';
import { ProjectsComponent } from './pages/project/projects.component';





export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'expiry-alerts', component: ExpiryAlertsComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'reminders', component: ReminderAlertsComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'project', component: ProjectsComponent }
];
