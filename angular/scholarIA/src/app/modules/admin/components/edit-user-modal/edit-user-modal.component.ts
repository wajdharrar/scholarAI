import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit {

  @Input() user: any;
  @Output() closed  = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  editForm: FormGroup;
  isLoading = false;

  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.editForm = this.fb.group({
      firstName:   ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[a-zA-Z]+$')]],
      lastName:    ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[a-zA-Z]+$')]],
      institution: ['', [Validators.maxLength(50), Validators.pattern('^[a-zA-Z]+$')]],
      country:     ['', [Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')]],
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.editForm.patchValue({
        firstName:   this.user.firstName   || '',
        lastName:    this.user.lastName    || '',
        institution: this.user.institution || '',
        country:     this.user.country     || '',
      });
      if (this.user.imageUrl) {
        this.imagePreviewUrl = this.user.imageUrl;
      }
    }
  }

  get firstName()   { return this.editForm.get('firstName'); }
  get lastName()    { return this.editForm.get('lastName'); }
  get institution() { return this.editForm.get('institution'); }
  get country()     { return this.editForm.get('country'); }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        Swal.fire('Invalid file', 'Images only.', 'error'); return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Too large', 'Max 5MB.', 'error'); return;
      }
      this.selectedImage = file;
      this.compressImage(file, (base64) => { this.imagePreviewUrl = base64; });
    }
  }

  compressImage(file: File, callback: (base64: string) => void): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 800;
        if (width > height) { if (width > maxDim) { height *= maxDim / width; width = maxDim; } }
        else                { if (height > maxDim) { width *= maxDim / height; height = maxDim; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) { ctx.drawImage(img, 0, 0, width, height); callback(canvas.toDataURL('image/jpeg', 0.7)); }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  close(): void { this.closed.emit(); }

  onSubmit(): void {
    if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }

    this.isLoading = true;
    const payload = {
      firstName:   this.editForm.value.firstName,
      lastName:    this.editForm.value.lastName,
      institution: this.editForm.value.institution || '',
      country:     this.editForm.value.country     || '',
      imageUrl:    this.imagePreviewUrl             || this.user?.imageUrl || ''
    };

    this.userService.updateProfile( payload).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({ icon: 'success', title: 'User updated!', timer: 1500, showConfirmButton: false });
        this.updated.emit();
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', err.error?.message || 'Failed to update user.', 'error');
      }
    });
  }
}