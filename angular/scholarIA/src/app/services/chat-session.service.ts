import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatSessionCreationRequest {
  title: string;
  description?: string;
  [key: string]: any;
}

export interface ChatSessionResponse {
  id: string;
  title: string;
  description?: string;
  userId?: string;
  messages?: string[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ChatSessionService {
  private apiUrl = 'http://localhost:8080/api/v1/chat_session';

  constructor(private http: HttpClient) { }

  /**
   * Add a new chat session
   */
  addChatSession(request: ChatSessionCreationRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, request);
  }

  /**
   * Get all chat sessions for current user
   */
  getAllChatSessionsByUserId(): Observable<ChatSessionResponse[]> {
    return this.http.get<ChatSessionResponse[]>(`${this.apiUrl}/user`);
  }

  /**
   * Get chat session by ID
   */
  getChatSessionById(chatSessionId: string): Observable<ChatSessionResponse> {
    return this.http.get<ChatSessionResponse>(`${this.apiUrl}/${chatSessionId}`);
  }
}
