import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { faCamera, faArrowRight, faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit{
  faCamera = faCamera;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;

  imageUrl: string = '';
  isLoading: boolean = false;
  hasSignupData: boolean = true;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const signupData = localStorage.getItem('signup_data');
    if (!signupData) {
      Swal.fire('Please complete Step 1 first', '', 'info');
      this.router.navigate(['/sign-up']);
      this.hasSignupData = false;
    } else {
      this.hasSignupData = true;
    }
  }

  compressImage(file: File, callback: (compressedBase64: string) => void): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const maxDim = 800;
        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedData = canvas.toDataURL('image/jpeg', 0.7);
          callback(compressedData);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  handleFileChange(file: File): void {
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'File too large',
        text: 'Please select an image smaller than 5MB.',
        icon: 'error'
      });
      return;
    }

    this.compressImage(file, (compressedBase64) => {
      this.imageUrl = compressedBase64;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFileChange(input.files[0]);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.handleFileChange(file);
    }
  }

  removeImage(): void {
    this.imageUrl = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  skip(): void {
    this.router.navigate(['/interests']);
  }

  continue(): void {
    this.isLoading = true;
    try {
      if (this.imageUrl) {
        localStorage.setItem('profile_photo', this.imageUrl);
        console.log('Profile photo saved to localStorage');
      }
      Swal.fire({
        icon: 'success',
        title: 'Step 2 complete!',
        text: "Let's select your interests.",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
      this.router.navigate(['/intrests']);
      })
    } catch (error) {
      console.error('Error saving photo:', error);
    } finally {
      this.isLoading = false;
    }
  }

  goBack(): void {
    this.location.back();
  }
}
