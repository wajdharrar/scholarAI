import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CollectionCreationRequest {
  name: string;
  description?: string;
  [key: string]: any;
}

export interface CollectionUpdateRequest {
  name?: string;
  description?: string;
  [key: string]: any;
}

export interface CollectionResponse {
  id: string;
  name: string;
  description?: string;
  userId?: string;
  papers?: string[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private apiUrl = 'http://localhost:8080/api/v1/collection';

  constructor(private http: HttpClient) { }

  /**
   * Add a new collection
   */
  addCollection(request: CollectionCreationRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, request);
  }

  /**
   * Update a collection
   */
  updateCollection(collectionId: string, request: CollectionUpdateRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${collectionId}`, request);
  }

  /**
   * Get all collections for current user
   */
  getAllCollectionsByUserId(): Observable<CollectionResponse[]> {
    return this.http.get<CollectionResponse[]>(`${this.apiUrl}/user`);
  }

  /**
   * Get collection by ID
   */
  getCollectionById(collectionId: string): Observable<CollectionResponse> {
    return this.http.get<CollectionResponse>(`${this.apiUrl}/${collectionId}`);
  }
}
