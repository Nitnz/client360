import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private baseUrl = 'http://localhost:5000/api/projects';

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createProject(project: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, project);
  }

  updateProject(id: string, project: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, project);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getExpiringProjects(days: number = 7): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.baseUrl}/expiring?days=${days}`);
  }
  getProjectsByClient(clientId: string) {
  return this.http.get<any[]>(`${this.baseUrl}/client/${clientId}`);
}
}