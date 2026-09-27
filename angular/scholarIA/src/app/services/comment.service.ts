import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CommentCreationRequest {
  content: string;
  researchPaperId: string;
  parentCommentId?: string;
  [key: string]: any;
}

export interface CommentUpdateRequest {
  content?: string;
  [key: string]: any;
}

export interface CommentResponse {
  id: string;
  content: string;
  paperId: string;
  userId?: string;
  parentCommentId?: string;
  likes?: number;
  replies?: CommentResponse[];
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
  username?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/v1/comment';

  constructor(private http: HttpClient) { }

  /**
   * Add a new comment
   */
  addComment(request: CommentCreationRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, request);
  }

  /**
   * Reply to a comment
   */
  replyToComment(request: CommentCreationRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reply`, request);
  }

  /**
   * Update a comment
   */
  updateComment(commentId: string, request: CommentUpdateRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${commentId}`, request);
  }

  /**
   * Signal/Report a comment
   */
  signalComment(commentId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/signal/${commentId}`, {});
  }

  /**
   * Like a comment
   */
  likeComment(commentId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/like/${commentId}`, {});
  }

  /**
   * Get comment by ID
   */
  getCommentById(commentId: string): Observable<CommentResponse> {
    return this.http.get<CommentResponse>(`${this.apiUrl}/${commentId}`);
  }

  /**
   * Get all comments
   */
  getAllComments(): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(`${this.apiUrl}/`);
  }
  /**
   * Get all comments by papers Id
   */
  getAllCommentsByPaperId(paperId: string): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(`${this.apiUrl}/paper/${paperId}`);
  }
}
