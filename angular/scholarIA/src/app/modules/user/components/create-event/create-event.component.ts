import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCalendarAlt, faClock, faMapMarkerAlt, faVideo, faUsers, faDollarSign, faImage, faSave, faTrash, faGlobe, faBuilding, faLaptop } from '@fortawesome/free-solid-svg-icons';
import { EventService } from 'app/services/event.service';
import Swal from 'sweetalert2';

const EVENT_TYPES = ['CONFERENCE', 'WORKSHOP', 'SEMINAR', 'WEBINAR', 'MEETUP', 'HACKATHON'];
const EVENT_FORMATS = ['IN_PERSON', 'ONLINE', 'HYBRID'];

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  // Icons
  faCalendarAlt = faCalendarAlt;
  faClock = faClock;
  faMapMarkerAlt = faMapMarkerAlt;
  faVideo = faVideo;
  faUsers = faUsers;
  faDollarSign = faDollarSign;
  faImage = faImage;
  faSave = faSave;
  faTrash = faTrash;
  faGlobe = faGlobe;
  faBuilding = faBuilding;
  faLaptop = faLaptop;

  eventForm: FormGroup;
  isLoading = false;

  // Selected image file
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;

  // Options for dropdowns
  eventTypes = EVENT_TYPES;
  eventFormats = EVENT_FORMATS;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private eventService:EventService
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(5000)]],
      eventType: ['', Validators.required],
      eventFormat: ['', Validators.required],
      location: [''],
      virtualLink: [''],
      startDateTime: ['', Validators.required],
      endDateTime: [''],
      registrationDeadline: [''],
      maxAttendees: ['', [Validators.min(1), Validators.max(10000)]],
      price: [0, [Validators.min(0), Validators.max(10000)]],
      currency: ['USD', Validators.required]
    });
  }

  ngOnInit(): void {
    // Set conditional validators when eventFormat changes
    this.eventForm.get('eventFormat')?.valueChanges.subscribe(format => {
      const locationControl = this.eventForm.get('location');
      const virtualLinkControl = this.eventForm.get('virtualLink');
      locationControl?.clearValidators();
      virtualLinkControl?.clearValidators();
      if (format === 'IN_PERSON') {
        locationControl?.setValidators([Validators.required]);
      } else if (format === 'ONLINE') {
        virtualLinkControl?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
      } else if (format === 'HYBRID') {
        locationControl?.setValidators([Validators.required]);
        virtualLinkControl?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
      }
      locationControl?.updateValueAndValidity();
      virtualLinkControl?.updateValueAndValidity();
    });
  }

  // Convenience getters
  get title() { return this.eventForm.get('title'); }
  get description() { return this.eventForm.get('description'); }
  get eventType() { return this.eventForm.get('eventType'); }
  get eventFormat() { return this.eventForm.get('eventFormat'); }
  get location() { return this.eventForm.get('location'); }
  get virtualLink() { return this.eventForm.get('virtualLink'); }
  get startDateTime() { return this.eventForm.get('startDateTime'); }
  get endDateTime() { return this.eventForm.get('endDateTime'); }
  get registrationDeadline() { return this.eventForm.get('registrationDeadline'); }
  get maxAttendees() { return this.eventForm.get('maxAttendees'); }
  get price() { return this.eventForm.get('price'); }
  get currency() { return this.eventForm.get('currency'); }

  // Image handling
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        Swal.fire('Invalid file', 'Please upload an image file (JPG, PNG, etc.).', 'error');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('File too large', 'Maximum image size is 2MB.', 'error');
        return;
      }
      this.selectedImage = file;
      this.imagePreviewUrl = URL.createObjectURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
      this.imagePreviewUrl = null;
    }
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      Object.keys(this.eventForm.controls).forEach(key => {
        const control = this.eventForm.get(key);
        control?.markAsTouched();
      });
      Swal.fire('Incomplete form', 'Please fill all required fields correctly.', 'warning');
      return;
    }

    // Additional custom validations
    const start = new Date(this.startDateTime?.value);
    const end = this.endDateTime?.value ? new Date(this.endDateTime.value) : null;
    const deadline = this.registrationDeadline?.value ? new Date(this.registrationDeadline.value) : null;

    if (end && end <= start) {
      Swal.fire('Invalid dates', 'End date/time must be after start date/time.', 'warning');
      return;
    }
    if (deadline && deadline >= start) {
      Swal.fire('Invalid deadline', 'Registration deadline must be before the event start.', 'warning');
      return;
    }

    this.isLoading = true;

    // Build FormData for multipart upload
    const formData = new FormData();
    formData.append('title', this.title!.value);
    formData.append('description', this.description!.value);
    formData.append('eventType', this.eventType!.value);
    formData.append('eventFormat', this.eventFormat!.value);
    if (this.location?.value) formData.append('location', this.location.value);
    if (this.virtualLink?.value) formData.append('virtualLink', this.virtualLink.value);
    formData.append('startDateTime', this.startDateTime!.value);
    if (this.endDateTime?.value) formData.append('endDateTime', this.endDateTime.value);
    if (this.registrationDeadline?.value) formData.append('registrationDeadline', this.registrationDeadline.value);
    if (this.maxAttendees?.value) formData.append('maxAttendees', this.maxAttendees.value);
    formData.append('price', this.price!.value);
    formData.append('currency', this.currency!.value);
    if (this.selectedImage) {
      formData.append('imageUrl', this.selectedImage);
    }
    console.log('Submitting event with data:', {
      title: this.title!.value,
      description: this.description!.value,
      eventType: this.eventType!.value,
      eventFormat: this.eventFormat!.value,
      location: this.location?.value,
      virtualLink: this.virtualLink?.value,
      startDateTime: this.startDateTime!.value,
      endDateTime: this.endDateTime?.value,
      registrationDeadline: this.registrationDeadline?.value,
      maxAttendees: this.maxAttendees?.value,
      price: this.price!.value,
      currency: this.currency!.value,
      image: this.selectedImage ? this.selectedImage.name : null
    });
    // Replace with your actual API endpoint
    this.eventService.addEvent(formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Event created!',
          text: 'Your event has been successfully published.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/user/dashboard']);
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
        Swal.fire('Error', error.error?.message || 'Failed to create event. Please try again.', 'error');
      }
    });
  }

}
