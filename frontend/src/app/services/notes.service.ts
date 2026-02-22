import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private baseUrl = 'http://localhost:5000/api/notes';

  constructor(private http: HttpClient) {}

  // ➕ Add note
  addNote(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // 📄 Get notes by project
  getNotesByProject(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/project/${projectId}`);
  }
}