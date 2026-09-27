import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { EventService } from 'app/services/event.service';

const EVENT_TYPES   = ['CONFERENCE', 'WORKSHOP', 'SEMINAR', 'WEBINAR', 'MEETUP', 'HACKATHON'];
const EVENT_FORMATS = ['IN_PERSON', 'ONLINE', 'HYBRID'];
const CURRENCIES    = ['USD', 'EUR', 'GBP', 'DZD', 'TND'];

@Component({
  selector: 'app-edit-event-modal',
  templateUrl: './edit-event-modal.component.html',
  styleUrls: ['./edit-event-modal.component.css']
})
export class EditEventModalComponent implements OnInit {

  @Input() event: any;
  @Output() closed  = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  editForm: FormGroup;
  isLoading = false;
  eventTypes   = EVENT_TYPES;
  eventFormats = EVENT_FORMATS;
  currencies   = CURRENCIES;

  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.editForm = this.fb.group({
      title:                ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      description:          ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
      eventType:            ['', Validators.required],
      eventFormat:          ['', Validators.required],
      location:             [''],
      virtualLink:          [''],
      startDateTime:        ['', Validators.required],
      endDateTime:          ['', Validators.required],
      registrationDeadline: ['', Validators.required],
      price:                [0, [Validators.required, Validators.min(0)]],
      currency:             ['USD', Validators.required],
      speakerCount:         [0, Validators.min(0)]
    });

    this.editForm.get('eventFormat')?.valueChanges.subscribe(format => {
      const loc = this.editForm.get('location');
      const vl  = this.editForm.get('virtualLink');
      loc?.clearValidators();
      vl?.clearValidators();
      if (format === 'IN_PERSON') {
        loc?.setValidators(Validators.required);
      } else if (format === 'ONLINE') {
        vl?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
      } else if (format === 'HYBRID') {
        loc?.setValidators(Validators.required);
        vl?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
      }
      loc?.updateValueAndValidity();
      vl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    if (this.event) {
      this.editForm.patchValue({
        title:                this.event.title                || '',
        description:          this.event.description          || '',
        eventType:            this.event.eventType            || '',
        eventFormat:          this.event.eventFormat          || '',
        location:             this.event.location             || '',
        virtualLink:          this.event.virtualLink          || '',
        startDateTime:        this.event.startDateTime        ? this.toDatetimeLocal(this.event.startDateTime) : '',
        endDateTime:          this.event.endDateTime          ? this.toDatetimeLocal(this.event.endDateTime)   : '',
        registrationDeadline: this.event.registrationDeadline ? this.toDatetimeLocal(this.event.registrationDeadline) : '',
        price:                this.event.price                ?? 0,
        currency:             this.event.currency             || 'USD',
        speakerCount:         this.event.speakerCount         ?? 0
      });
      if (this.event.imageUrl) {
        this.imagePreviewUrl = this.getFileUrl(this.event.imageUrl);
      }
    }
  }

  // Convert ISO string to datetime-local format
  toDatetimeLocal(value: string): string {
    if (!value) return '';
    return new Date(value).toISOString().slice(0, 16);
  }

  getFileUrl(fullPath: string): string {
    if (!fullPath) return '';
    const filename = fullPath.split('\\').pop()?.split('/').pop() || '';
    return `http://localhost:8080/api/v1/files/${filename}`;
  }

  get title()                { return this.editForm.get('title'); }
  get description()          { return this.editForm.get('description'); }
  get eventType()            { return this.editForm.get('eventType'); }
  get eventFormat()          { return this.editForm.get('eventFormat'); }
  get location()             { return this.editForm.get('location'); }
  get virtualLink()          { return this.editForm.get('virtualLink'); }
  get startDateTime()        { return this.editForm.get('startDateTime'); }
  get endDateTime()          { return this.editForm.get('endDateTime'); }
  get registrationDeadline() { return this.editForm.get('registrationDeadline'); }
  get price()                { return this.editForm.get('price'); }
  get currency()             { return this.editForm.get('currency'); }
  get speakerCount()         { return this.editForm.get('speakerCount'); }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) { Swal.fire('Invalid file', 'Images only.', 'error'); return; }
      if (file.size > 2 * 1024 * 1024)    { Swal.fire('Too large', 'Max 2MB.', 'error'); return; }
      this.selectedImage = file;
      this.imagePreviewUrl = URL.createObjectURL(file);
    }
  }

  close(): void { this.closed.emit(); }

  onSubmit(): void {
    if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }

    this.isLoading = true;
    const v = this.editForm.value;
    const formData = new FormData();
    formData.append('title',                v.title);
    formData.append('description',          v.description);
    formData.append('eventType',            v.eventType);
    formData.append('eventFormat',          v.eventFormat);
    formData.append('startDateTime',        v.startDateTime);
    formData.append('endDateTime',          v.endDateTime);
    formData.append('registrationDeadline', v.registrationDeadline);
    formData.append('price',               v.price);
    formData.append('currency',             v.currency);
    formData.append('speakerCount',         v.speakerCount);
    if (v.location)          formData.append('location',    v.location);
    if (v.virtualLink)       formData.append('virtualLink', v.virtualLink);
    if (this.selectedImage)  formData.append('imageUrl',    this.selectedImage);

    this.eventService.updateEvent(this.event.id, formData).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({ icon: 'success', title: 'Event updated!', timer: 1500, showConfirmButton: false });
        this.updated.emit();
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', err.error?.message || 'Failed to update event.', 'error');
      }
    });
  }
}