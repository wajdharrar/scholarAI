import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-event-detail-modal',
  templateUrl: './event-detail-modal.component.html',
  styleUrls: ['./event-detail-modal.component.css']
})
export class EventDetailModalComponent {

  @Input() event: any;
  @Output() closed = new EventEmitter<void>();

  close(): void { this.closed.emit(); }

  getFileUrl(fullPath: string): string {
    if (!fullPath) return '';
    const filename = fullPath.split('\\').pop()?.split('/').pop() || '';
    return `http://localhost:8080/api/v1/files/${filename}`;
  }

  getFormatLabel(format: string): string {
    switch (format) {
      case 'IN_PERSON': return 'In Person';
      case 'ONLINE':    return 'Online';
      case 'HYBRID':    return 'Hybrid';
      default:          return format;
    }
  }
}