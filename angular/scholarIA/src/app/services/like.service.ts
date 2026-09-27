import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LikeCreationRequest {
  researchPaperId: string;
  [key: string]: any;
}

export interface LikeResponse {
  id: string;
  paperId: string;
  userId?: string;
  createdAt?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = 'http://localhost:8080/api/v1/like';

  constructor(private http: HttpClient) { }

  /**
   * Add a like to a paper
   */
  addLike(request: LikeCreationRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, request);
  }

  /**
   * Get like by ID
   */
  getLikeById(likeId: string): Observable<LikeResponse> {
    return this.http.get<LikeResponse>(`${this.apiUrl}/${likeId}`);
  }

  /**
   * Get all likes by user ID
   */
  getAllLikesByUserId(userId: string): Observable<LikeResponse[]> {
    return this.http.get<LikeResponse[]>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Get all likes by paper ID
   */
  getAllLikesByPaperId(paperId: string): Observable<LikeResponse[]> {
    return this.http.get<LikeResponse[]>(`${this.apiUrl}/${paperId}`);
  }
}
