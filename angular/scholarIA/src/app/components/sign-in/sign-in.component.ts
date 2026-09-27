import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { faEnvelope, faLock, faArrowRight, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  signInForm: FormGroup;
  isLoading = false;
  focusedField: string | null = null;

  // Icons
  faGoogle = faGoogle;
  faGithub = faGithub;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faArrowRight = faArrowRight;
  faExclamationCircle = faExclamationCircle;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticationService,
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get isValid(): boolean {
    return this.signInForm.valid;
  }

  onSubmit(): void {
    if (this.signInForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const formData = this.signInForm.value;

    this.authService.login(formData).subscribe({
      next: (response: any) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        Swal.fire({
          title: 'Success',
          text: 'Signed in successfully!',
          icon: 'success',
          timer: 2000
        });
        if(formData.email === 'admin@gmail.com') {
          this.router.navigate(['/admin']);
          return;
        }
        this.router.navigate(['/user']);
      },
      error: (error) => {
        console.error('Sign in failed:', error);
        const message = error.error?.message || 'Sign in failed. Please check your credentials.';
        Swal.fire({
          title: 'Error',
          text: message,
          icon: 'error'
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Optional: helper to track focus for styling
  onFocus(field: string): void {
    this.focusedField = field;
  }

  onBlur(): void {
    this.focusedField = null;
  }
}
