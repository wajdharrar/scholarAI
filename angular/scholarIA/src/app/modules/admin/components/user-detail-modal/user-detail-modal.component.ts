import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-detail-modal',
  templateUrl: './user-detail-modal.component.html',
  styleUrls: ['./user-detail-modal.component.css']
})
export class UserDetailModalComponent {

  @Input() user: any;
  @Output() closed = new EventEmitter<void>();

  close(): void { this.closed.emit(); }

  getInitials(firstName: string, lastName: string): string {
    return ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase();
  }

  formatDate(date: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}