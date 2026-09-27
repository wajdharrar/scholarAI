import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentResponse } from './comment.service';

export interface PaperCreationRequest {
  title: string;
  abstract?: string;
  authors?: string[];
  publicationDate?: string;
  url?: string;
  domainId?: string;
  [key: string]: any;
}

export interface PaperUpdateRequest {
  title?: string;
  abstract?: string;
  authors?: string[];
  publicationDate?: string;
  url?: string;
  domainId?: string;
  [key: string]: any;
}

export interface ResearchPaperResponse {
  id: string;
  title: string;
  abstractText: string;
  thumbnailUrl?: string;
  category: string;
  document?: string;
  authorIds?: string[];
  keywords: string[];
  commentCount: number;
  likesCount: number;        
  downloadsCount: number;    
  citations: number;      
  publicationDate: string;
  status:string;   
  comments?: CommentResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class ResearchPaperService {
  private apiUrl = 'http://localhost:8080/api/v1/papers';

  constructor(private http: HttpClient) { }

  /**
   * Add a new research paper
   */
  addResearchPaper(request: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, request);
  }

  /**
   * Update a research paper
   */
  updateResearchPaper(paperId: string, request: PaperUpdateRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${paperId}`, request);
  }

  /**
   * Validate a research paper
   */
  validateResearchPaper(paperId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/validate/${paperId}`, {});
  }

  /**
   * Reject a research paper
   */
  rejectResearchPaper(paperId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/reject/${paperId}`, {});
  }

  /**
   * Get research paper by ID
   */
  getResearchPaperById(paperId: string): Observable<ResearchPaperResponse> {
    return this.http.get<ResearchPaperResponse>(`${this.apiUrl}/${paperId}`);
  }

  /**
   * Get all research papers
   */
  getAllResearchPapers(): Observable<ResearchPaperResponse[]> {
    return this.http.get<ResearchPaperResponse[]>(`${this.apiUrl}`);
  }
  getRecommendationResearchPapers(): Observable<ResearchPaperResponse[]> {
    return this.http.get<ResearchPaperResponse[]>(`${this.apiUrl}/recommendation`);
  }
  getResearchPaperByUserId(userId: string): Observable<ResearchPaperResponse[]> {
    return this.http.get<ResearchPaperResponse[]>(`${this.apiUrl}/user`);
  }
}
