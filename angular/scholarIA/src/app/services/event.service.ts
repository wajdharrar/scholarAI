import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventCreationRequest {
  title: string;
  description?: string;
  eventType: string;
  eventFormat: string;
  location?: string;
  virtualLink?: string;
  startDateTime: string;
  endDateTime?: string;
  registrationDeadline?: string;
  maxAttendees?: number;
  price: number;
  currency: string;
  image?: File;
}

export interface EventUpdateRequest {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  [key: string]: any;
}

export interface EventResponse {
  id: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  eventType?:string;
  eventFormat?:string;
  registrationDeadline?:string;
  price?:number;
  currency?:string;
  imageUrl?:string;
  speakerCount?:number;
  organizer?:string;
  startDateTime?:string;
  endDateTime?:string;
  status?:string;
  virtualLink?:string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/v1/event';

  constructor(private http: HttpClient) { }

  /**
   * Add a new event
   */
  addEvent(request: FormData): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, request);
  }

  /**
   * Update an event
   */
  updateEvent(eventId: string, request: EventUpdateRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${eventId}`, request);
  }

  /**
   * Validate an event
   */
  validateEvent(eventId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/validate/${eventId}`, {});
  }

  /**
   * Reject an event
   */
  rejectEvent(eventId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/reject/${eventId}`, {});
  }

  /**
   * Get event by ID
   */
  getEventById(eventId: string): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.apiUrl}/${eventId}`);
  }

  /**
   * Get all events
   */
  getAllEvents(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.apiUrl}/`);
  }
  getAllEventsByOrganizerId(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`);
  }
}
