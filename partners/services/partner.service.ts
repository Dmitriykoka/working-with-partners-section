import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Partner, PartnerCategory } from '../models/partner.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private apiUrl = 'api/partners';

  constructor(private http: HttpClient) {}

  getAllPartners(): Observable<Partner[]> {
    return this.http.get<Partner[]>(this.apiUrl);
  }

  getPartnersByManager(managerId: string): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${this.apiUrl}?managerId=${managerId}`);
  }

  getPartnerById(id: string): Observable<Partner> {
    return this.http.get<Partner>(`${this.apiUrl}/${id}`);
  }

  createPartner(partner: Partner): Observable<Partner> {
    return this.http.post<Partner>(this.apiUrl, partner);
  }

  updatePartner(id: string, partner: Partner): Observable<Partner> {
    return this.http.put<Partner>(`${this.apiUrl}/${id}`, partner);
  }

  deletePartner(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<PartnerCategory[]> {
    return this.http.get<PartnerCategory[]>(`${this.apiUrl}/categories`);
  }

  updateCategoryFrequency(categoryId: string, frequencyDays: number): Observable<PartnerCategory> {
    return this.http.patch<PartnerCategory>(`${this.apiUrl}/categories/${categoryId}`, { defaultContactFrequencyDays: frequencyDays });
  }
}