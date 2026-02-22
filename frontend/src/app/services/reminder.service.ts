import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  private baseUrl = 'http://localhost:5000/api/reminders';
  constructor(private http: HttpClient) {}

  getReminders(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createReminder(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  deleteReminder(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}