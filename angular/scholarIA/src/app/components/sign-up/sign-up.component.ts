import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { faUser, faEnvelope,faBuildingColumns, faLock,faEarthEurope } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signupForm: FormGroup;
  isLoading = false;

  // Icons
  faGoogle = faGoogle;
  faGithub = faGithub;
  faUser = faUser;

  faLock = faLock;
  faBuildingColumns =faBuildingColumns;
  faEnvelope = faEnvelope;
  faEarthEurope = faEarthEurope;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)]],
      confirmPassword: ['', Validators.required],
      institution: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      country: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Helper getters for template
  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get institution() { return this.signupForm.get('institution'); }
  get country() { return this.signupForm.get('country'); }

  // Custom validator: passwords match
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  // Helper methods for password strength indicators
  hasUpperCase(str: string): boolean {
    return /[A-Z]/.test(str);
  }
  hasNumber(str: string): boolean {
    return /[0-9]/.test(str);
  }
  hasSpecialChar(str: string): boolean {
    return /[!@#$%^&*]/.test(str);
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    this.isLoading = true;

    // Save registration data to localStorage
    const registrationData = {
      firstName: this.firstName?.value,
      lastName: this.lastName?.value,
      email: this.email?.value,
      password: this.password?.value,
      confirmPassword: this.confirmPassword?.value,
      institution: this.institution?.value,
      country: this.country?.value
    };

    localStorage.setItem('signup_data', JSON.stringify(registrationData));
    console.log('Signup data saved to localStorage:', registrationData);

    // SweetAlert2 success message
    Swal.fire({
      icon: 'success',
      title: 'Step 1 complete!',
      text: "Let's add your photo.",
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/photo']);
    }).catch((error) => {
      // In case of error (though unlikely with sweetalert)
      this.router.navigate(['/photo']);
    });
    this.isLoading = false;
  }
}