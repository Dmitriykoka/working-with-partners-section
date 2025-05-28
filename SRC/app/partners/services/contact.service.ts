import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/partner.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'api/contacts';

  constructor(private http: HttpClient) {}

  getContactsByManager(managerId: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}?managerId=${managerId}`);
  }

  getContactsByPartner(partnerId: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}?partnerId=${partnerId}`);
  }

  getPlannedContacts(startDate: Date, endDate: Date): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/planned?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  updateContact(id: string, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact);
  }

  completeContact(id: string, notes: string): Observable<Contact> {
    return this.http.patch<Contact>(`${this.apiUrl}/${id}/complete`, { notes });
  }

  rescheduleContact(id: string, newDate: Date, reason: string): Observable<Contact> {
    return this.http.patch<Contact>(`${this.apiUrl}/${id}/reschedule`, { newDate, reason });
  }
}