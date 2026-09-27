import { Component } from '@angular/core';
import { faBuilding, faCalendarAlt, faCalendarCheck, faCalendarDay, faCalendarWeek, faCheckCircle, faChevronLeft, faChevronRight, faClock, faDownload, faEdit, faEllipsisVertical, faEye, faFilter, faGlobe, faLink, faMapMarkerAlt, faPlus, faRefresh, faSearch, faSort, faSortDown, faSortUp, faTag, faTrash, faUsers, faUserTie, faVideo, faXmarkCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { EventResponse, EventService } from 'app/services/event.service';
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'DRAFT';
export type EventFormat = 'IN_PERSON' | 'ONLINE' | 'HYBRID';
 
export interface AcademicEvent {
  id: number;
  title: string;
  organizer: string;
  location: string;
  type: string;
  format: EventFormat;
  category: string;
  status: EventStatus;
  startDate: string;
  endDate: string;
  time: string;
  attendees: number;
  maxAttendees: number;
  speakers: number;
  price: number;
  currency: string;
  registrationDeadline: string;
  description: string;
  website: string;
  tags: string;
}
 
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}
 
export interface FormatBadge {
  bgClass: string;
  textClass: string;
  icon: IconDefinition;
  label: string;
}
@Component({
  selector: 'app-admin-events',
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.css']
})
export class AdminEventsComponent {
faSearch = faSearch;
  faFilter = faFilter;
  faPlus = faPlus;
  faDownload = faDownload;
  faEllipsisVertical = faEllipsisVertical;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faRefresh = faRefresh;
  faCalendarAlt = faCalendarAlt;
  faMapMarkerAlt = faMapMarkerAlt;
  faUsers = faUsers;
  faClock = faClock;
  faVideo = faVideo;
  faUserTie = faUserTie;
  faTag = faTag;
  faGlobe = faGlobe;
  faBuilding = faBuilding;
  faLink = faLink;
  faCheckCircle = faCheckCircle;
  faXmarkCircle = faXmarkCircle;
  faCalendarCheck = faCalendarCheck;
  faCalendarDay = faCalendarDay;
  faCalendarWeek = faCalendarWeek;
 
  events: EventResponse[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortConfig: SortConfig = { key: 'startDate', direction: 'asc' };
  selectedFilter = 'all';
  selectedFormat = 'all';
  selectedType = 'all';
  showFilterMenu = false;
  showFormatMenu = false;
  showTypeMenu = false;
  selectedEvents: string[] = [];
  viewMode: 'list' | 'calendar' = 'list';
 
  statusFilters = ['all', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'DRAFT'];
 
  constructor(
    private eventService: EventService
  ) { }
  ngOnInit(): void {
    this.generateEvents();
  }
 
  private generateEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
      },
      error: (err) => {
        console.error('Error loading events:', err);
      }
    });
  }
 
  // ── Computed getters ──────────────────────────────────────────
 
 get types(): string[] {
  return ['all', ...new Set(this.events.map(e => e.eventType).filter((t): t is string => !!t))];
  }

  // Fix formats getter
  get formats(): string[] {
    return ['all', ...new Set(this.events.map(e => e.eventFormat).filter((f): f is string => !!f))];
  }
 
  get upcomingCount(): number {
    return this.events.filter(e => e.status === 'UPCOMING').length;
  }
 
  get ongoingCount(): number {
    return this.events.filter(e => e.status === 'ONGOING').length;
  }
  get virtualCount(): number {
    return this.events.filter(e => e.eventFormat === 'ONLINE').length;
  }
  get underReviewCount(): number {
    return this.events.filter(e => e.status === 'DRAFT').length;
  }
 
  get filteredEvents(): EventResponse[] {
    const term = this.searchTerm.toLowerCase();
    return this.events.filter(event => {
      const matchesSearch =
        event.title?.toLowerCase().includes(term) ||
        event.organizer?.toLowerCase().includes(term) ||
        event.location?.toLowerCase().includes(term);
      const matchesStatus = this.selectedFilter === 'all' || event.status === this.selectedFilter;
      const matchesFormat = this.selectedFormat === 'all' || event.eventFormat === this.selectedFormat;
      const matchesType = this.selectedType === 'all' || event.eventType === this.selectedType;
      return matchesSearch && matchesStatus && matchesFormat && matchesType;
    });
  }
 
  get sortedEvents(): EventResponse[] {
    return [...this.filteredEvents].sort((a, b) => {
      const aVal = a[this.sortConfig.key as keyof EventResponse];
      const bVal = b[this.sortConfig.key as keyof EventResponse];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return this.sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return this.sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }
 
  get totalPages(): number {
    return Math.ceil(this.sortedEvents.length / this.itemsPerPage);
  }
 
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }
 
  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.sortedEvents.length);
  }
 
  get paginatedEvents(): EventResponse[] {
    return this.sortedEvents.slice(this.startIndex, this.startIndex + this.itemsPerPage);
  }
 
  get hasActiveFilters(): boolean {
    return this.selectedFilter !== 'all' || this.selectedFormat !== 'all' || this.selectedType !== 'all';
  }
 
  get upcomingEventsSample(): EventResponse[] {
    return this.events.filter(e => e.status === 'UPCOMING').slice(0, 3);
  }
 
  // ── Sorting ───────────────────────────────────────────────────
 
  setSort(key: string): void {
    this.sortConfig = {
      key,
      direction: this.sortConfig.key === key && this.sortConfig.direction === 'asc' ? 'desc' : 'asc'
    };
  }
 
  getSortIcon(key: string): IconDefinition {
    if (this.sortConfig.key !== key) return faSort;
    return this.sortConfig.direction === 'asc' ? faSortUp : faSortDown;
  }
 
  // ── Selection ─────────────────────────────────────────────────
 
  isAllSelected(): boolean {
    return this.paginatedEvents.length > 0 &&
      this.paginatedEvents.every(e => this.selectedEvents.includes(e.id));
  }
 
  toggleSelectAll(): void {
    this.isAllSelected()
      ? this.selectedEvents = []
      : this.selectedEvents = this.paginatedEvents.map(e => e.id);
  }
 
  toggleSelectEvent(id: string): void {
    this.selectedEvents = this.selectedEvents.includes(id)
      ? this.selectedEvents.filter(eid => eid !== id)
      : [...this.selectedEvents, id];
  }
 
  // ── Filters ───────────────────────────────────────────────────
 
  selectStatusFilter(filter: string): void {
    this.selectedFilter = filter;
    this.showFilterMenu = false;
    this.currentPage = 1;
  }
 
  selectFormatFilter(format: string): void {
    this.selectedFormat = format;
    this.showFormatMenu = false;
    this.currentPage = 1;
  }
 
  selectTypeFilter(type: string): void {
    this.selectedType = type;
    this.showTypeMenu = false;
    this.currentPage = 1;
  }
 
  getCountByStatus(status: string): number {
    return this.events.filter(e => e.status === status).length;
  }
 
  getCountByFormat(format: string): number {
    return this.events.filter(e => e.eventFormat === format).length;
  }
 
  getCountByType(type: string): number {
    return this.events.filter(e => e.eventType === type).length;
  }
 
  formatLabel(value: string): string {
    return value.replace('_', ' ');
  }
 
  // ── Pagination ────────────────────────────────────────────────
 
  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
 
  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }
 
  goToPage(page: number): void {
    this.currentPage = page;
  }
 
  getPageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 5;
    let start = 1;
 
    if (total <= maxVisible) {
      start = 1;
    } else if (current <= 3) {
      start = 1;
    } else if (current >= total - 2) {
      start = total - maxVisible + 1;
    } else {
      start = current - 2;
    }
 
    return Array.from({ length: Math.min(maxVisible, total) }, (_, i) => start + i);
  }
 
  onItemsPerPageChange(value: string): void {
    this.itemsPerPage = Number(value);
    this.currentPage = 1;
  }
 
  getAttendancePercent(event: AcademicEvent): number {
    return Math.min((event.attendees / event.maxAttendees) * 100, 100);
  }
 
  // ── Styling helpers ───────────────────────────────────────────
 
  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'UPCOMING':  return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ONGOING':   return 'bg-green-100 text-green-700 border-green-200';
      case 'COMPLETED': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default:          return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }
 
  getStatusIcon(status: string | undefined): IconDefinition {
    switch (status) {
      case 'UPCOMING':  return faCalendarDay;
      case 'ONGOING':   return faClock;
      case 'COMPLETED': return faCheckCircle;
      case 'CANCELLED': return faXmarkCircle;
      case 'DRAFT': return faClock;
      default:          return faCalendarAlt;
    }
  }
 
  getFormatBadge(format: string | undefined): FormatBadge {
    switch (format) {
      case 'IN_PERSON': return { bgClass: 'bg-purple-100', textClass: 'text-purple-700', icon: faBuilding, label: 'In Person' };
      case 'ONLINE':   return { bgClass: 'bg-cyan-100',   textClass: 'text-cyan-700',   icon: faVideo,    label: 'Virtual' };
      case 'HYBRID':    return { bgClass: 'bg-amber-100',  textClass: 'text-amber-700',  icon: faGlobe,    label: 'Hybrid' };
      default:         return { bgClass: 'bg-gray-100',   textClass: 'text-gray-700',   icon: faTag,      label: 'Unknown' };
    }
  }
 
  // ── Actions ───────────────────────────────────────────────────
 
  refreshEvents(): void { this.generateEvents(); }
  deleteEvent(id: string): void { /* implement */ }
  showAddModal    = false;
  showEditModal   = false;
  showDetailModal = false;
  selectedEvent: any = null;

  addEvent(): void { this.showAddModal = true; }

  editEvent(id: string): void {
    this.selectedEvent = this.events.find(e => e.id === id);
    this.showEditModal = true;
  }

  viewEvent(id: string): void {
    this.selectedEvent = this.events.find(e => e.id === id);
    this.showDetailModal = true;
  }

  onEventCreated(): void  { this.generateEvents(); }
  onEventUpdated(): void  { this.generateEvents(); }
}
