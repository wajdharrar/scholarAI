import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faGlobe, faFileAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-domain-detail-modal',
  templateUrl: './domain-detail-modal.component.html',
  styleUrls: ['./domain-detail-modal.component.css']
})
export class DomainDetailModalComponent {

  @Input() domain: any;
  @Output() closed = new EventEmitter<void>();

  faGlobe   = faGlobe;
  faFileAlt = faFileAlt;

  close(): void { this.closed.emit(); }
}