import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DomainCreationRequest {
  name: string;
  description?: string;
  [key: string]: any;
}

export interface DomainUpdateRequest {
  name?: string;
  description?: string;
  [key: string]: any;
}

export interface DomainResponse {
  id: string;
  name: string;
  logo: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private apiUrl = 'http://localhost:8080/api/v1/domains';

  constructor(private http: HttpClient) { }

  /**
   * Add a new domain
   */
  addDomain(request: DomainCreationRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, request);
  }

  /**
   * Update a domain
   */
  updateDomain(domainId: string, request: DomainUpdateRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${domainId}`, request);
  }

  /**
   * Get domain by ID
   */
  getDomainById(domainId: string): Observable<DomainResponse> {
    return this.http.get<DomainResponse>(`${this.apiUrl}/${domainId}`);
  }

  /**
   * Get all domains
   */
  getAllDomains(): Observable<DomainResponse[]> {
    return this.http.get<DomainResponse[]>(`${this.apiUrl}/`);
  }
  deleteDomain(domainId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${domainId}`);
  }
}
