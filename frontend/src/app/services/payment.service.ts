import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private baseUrl = 'http://localhost:5000/api/payments';

  constructor(private http: HttpClient) {}

  // ✅ list payments for a project
  getPaymentsByProject(projectId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/project/${projectId}`);
  }

  // ✅ add payment
  createPayment(data: any) {
    return this.http.post<any>(this.baseUrl, data);
  }

  // ✅ delete payment
  deletePayment(id: string) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // (optional)
  getSummary(projectId: string) {
    return this.http.get<any>(`${this.baseUrl}/summary/${projectId}`);
  }
}