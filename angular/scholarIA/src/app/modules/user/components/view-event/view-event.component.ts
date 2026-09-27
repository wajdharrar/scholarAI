import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCalendarAlt, faMapMarkerAlt, faVideo, faUsers, faDollarSign, faMicrophone, faSearch, faFilter, faClock, faGlobe, faBuilding, faLaptop } from '@fortawesome/free-solid-svg-icons';
import { EventResponse, EventService } from 'app/services/event.service';

export enum EventType {
  CONFERENCE = 'CONFERENCE',
  WORKSHOP = 'WORKSHOP',
  SEMINAR = 'SEMINAR',
  WEBINAR = 'WEBINAR',
  MEETUP = 'MEETUP',
  HACKATHON = 'HACKATHON'
}

export enum EventFormat {
  IN_PERSON = 'IN_PERSON',
  VIRTUAL = 'VIRTUAL',
  HYBRID = 'HYBRID'
}

export interface UserResponse {
  id: string;
  name: string;
  email?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  eventFormat: EventFormat;
  location?: string;
  virtualLink?: string;
  startDateTime: Date;
  endDateTime?: Date;
  registrationDeadline?: Date;
  price: number;
  speakerCount: number;
  currency: string;
  imageUrl?: string;
  attendees: Set<UserResponse>;
}

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent implements OnInit {
    faCalendarAlt = faCalendarAlt;
  faMapMarkerAlt = faMapMarkerAlt;
  faVideo = faVideo;
  faUsers = faUsers;
  faDollarSign = faDollarSign;
  faMicrophone = faMicrophone;
  faSearch = faSearch;
  faFilter = faFilter;
  faClock = faClock;
  faGlobe = faGlobe;
  faBuilding = faBuilding;
  faLaptop = faLaptop;

  events: any[] = [];
  filteredEvents: Event[] = [];
  isLoading = true;
  searchTerm = '';
  selectedEventType: string = 'all';
  eventTypes = Object.values(EventType);

  constructor(private router: Router, private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEventsByOrganizerId().subscribe({
      next: (events) => {
        this.events = events.map((e: any) => ({
          ...e,
          imageUrl: this.getFileUrl(e.imageUrl)
        }));
        console.log('Loaded events:', this.events);
        this.filterEvents();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }
  getFileUrl(fullPath: string): string {
    if (!fullPath) return '';
    const filename = fullPath.split('\\').pop()?.split('/').pop() || '';
    return `http://localhost:8080/api/v1/files/${filename}`;
  }

  filterEvents(): void {
    let filtered = this.events;
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(term) ||
        e.description.toLowerCase().includes(term)
      );
    }
    if (this.selectedEventType !== 'all') {
      filtered = filtered.filter(e => e.eventType === this.selectedEventType);
    }
    this.filteredEvents = filtered;
  }

  onSearchChange(): void {
    this.filterEvents();
  }

  onEventTypeChange(): void {
    this.filterEvents();
  }

  viewEvent(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  formatDateRange(event: Event): string {
    const start = new Date(event.startDateTime);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (event.endDateTime) {
      const end = new Date(event.endDateTime);
      const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (startStr === endStr) return startStr;
      return `${startStr} - ${endStr}`;
    }
    return startStr;
  }

  getAttendeeCount(event: Event): number {
    return event.attendees.size;
  }

  isFree(price: number): boolean {
    return price === 0;
  }

  getFormatIcon(format: EventFormat): any {
    switch (format) {
      case EventFormat.IN_PERSON: return faBuilding;
      case EventFormat.VIRTUAL: return faLaptop;
      case EventFormat.HYBRID: return faGlobe;
      default: return faCalendarAlt;
    }
  }
}
