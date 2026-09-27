import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddPaperToCollectionRequest {
  paperId: string;
  collectionId: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class SavedPaperService {
  private apiUrl = 'http://localhost:8080/api/v1/saved_paper';

  constructor(private http: HttpClient) { }

  /**
   * Add a paper to a collection
   */
  addPaperToCollection(request: AddPaperToCollectionRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, request);
  }

  /**
   * Remove a paper from a collection
   */
  removePaperFromCollection(request: AddPaperToCollectionRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/remove`, request);
  }
}
