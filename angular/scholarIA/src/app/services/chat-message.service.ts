import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessageCreationRequest {
  content: string;
  sessionId: string;
  [key: string]: any;
}

export interface ChatMessageUpdateRequest {
  content?: string;
  [key: string]: any;
}

export interface ChatMessageResponse {
  id: string;
  content: string;
  sessionId: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private apiUrl = 'http://localhost:8080/api/v1/chat_message';

  constructor(private http: HttpClient) { }

  /**
   * Add a new chat message
   */
  addChatMessage(request: ChatMessageCreationRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, request);
  }

  /**
   * Update a chat message
   */
  updateChatMessage(chatMessageId: string, request: ChatMessageUpdateRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${chatMessageId}`, request);
  }

  /**
   * Get all messages by session ID
   */
  getAllChatMessagesBySessionId(sessionId: string): Observable<ChatMessageResponse[]> {
    return this.http.get<ChatMessageResponse[]>(`${this.apiUrl}/session/${sessionId}`);
  }

  /**
   * Get chat message by ID
   */
  getChatMessageById(chatMessageId: string): Observable<ChatMessageResponse> {
    return this.http.get<ChatMessageResponse>(`${this.apiUrl}/${chatMessageId}`);
  }
}
