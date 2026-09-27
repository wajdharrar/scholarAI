import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { EventService } from 'app/services/event.service';

const EVENT_TYPES = ['CONFERENCE', 'WORKSHOP', 'SEMINAR', 'WEBINAR', 'MEETUP', 'HACKATHON'];
const EVENT_FORMATS = ['IN_PERSON', 'ONLINE', 'HYBRID'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'DZD', 'TND'];

@Component({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.css']
})
export class AddEventModalComponent {

  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  addForm: FormGroup;
  isLoading = false;
  eventTypes = EVENT_TYPES;
  eventFormats = EVENT_FORMATS;
  currencies = CURRENCIES;

  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.addForm = this.fb.group({
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
      speakerCount:         [0, [Validators.min(0)]]
    });

    this.addForm.get('eventFormat')?.valueChanges.subscribe(format => {
      const loc = this.addForm.get('location');
      const vl  = this.addForm.get('virtualLink');
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

  get title()                { return this.addForm.get('title'); }
  get description()          { return this.addForm.get('description'); }
  get eventType()            { return this.addForm.get('eventType'); }
  get eventFormat()          { return this.addForm.get('eventFormat'); }
  get location()             { return this.addForm.get('location'); }
  get virtualLink()          { return this.addForm.get('virtualLink'); }
  get startDateTime()        { return this.addForm.get('startDateTime'); }
  get endDateTime()          { return this.addForm.get('endDateTime'); }
  get registrationDeadline() { return this.addForm.get('registrationDeadline'); }
  get price()                { return this.addForm.get('price'); }
  get currency()             { return this.addForm.get('currency'); }
  get speakerCount()         { return this.addForm.get('speakerCount'); }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        Swal.fire('Invalid file', 'Please upload an image.', 'error'); return;
      }
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('File too large', 'Max 2MB.', 'error'); return;
      }
      this.selectedImage = file;
      this.imagePreviewUrl = URL.createObjectURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    if (this.imagePreviewUrl) { URL.revokeObjectURL(this.imagePreviewUrl); this.imagePreviewUrl = null; }
  }

  close(): void { this.closed.emit(); }

  onSubmit(): void {
    if (this.addForm.invalid) { this.addForm.markAllAsTouched(); return; }

    const start = new Date(this.startDateTime!.value);
    const end   = new Date(this.endDateTime!.value);
    const dead  = new Date(this.registrationDeadline!.value);

    if (end <= start) { Swal.fire('Invalid dates', 'End must be after start.', 'warning'); return; }
    if (dead >= start) { Swal.fire('Invalid deadline', 'Deadline must be before start.', 'warning'); return; }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('title',                this.addForm.value.title);
    formData.append('description',          this.addForm.value.description);
    formData.append('eventType',            this.addForm.value.eventType);
    formData.append('eventFormat',          this.addForm.value.eventFormat);
    formData.append('startDateTime',        this.addForm.value.startDateTime);
    formData.append('endDateTime',          this.addForm.value.endDateTime);
    formData.append('registrationDeadline', this.addForm.value.registrationDeadline);
    formData.append('price',               this.addForm.value.price);
    formData.append('currency',             this.addForm.value.currency);
    formData.append('speakerCount',         this.addForm.value.speakerCount);
    if (this.addForm.value.location)    formData.append('location',    this.addForm.value.location);
    if (this.addForm.value.virtualLink) formData.append('virtualLink', this.addForm.value.virtualLink);
    if (this.selectedImage)             formData.append('imageUrl',    this.selectedImage);

    this.eventService.addEvent(formData).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({ icon: 'success', title: 'Event created!', timer: 1500, showConfirmButton: false });
        this.created.emit();
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', err.error?.message || 'Failed to create event.', 'error');
      }
    });
  }
}