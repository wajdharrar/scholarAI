import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css']
})
export class AddUserModalComponent {

  @Output() closed  = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  addForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthenticationService) {
    this.addForm = this.fb.group({
      firstName:       ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[a-zA-Z]+$')]],
      lastName:        ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[a-zA-Z]+$')]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50),
                             Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      confirmPassword: ['', [Validators.required]],
      institution:     ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[a-zA-Z]+$')]],
      country:         ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20), Validators.pattern('^[a-zA-Z]+$')]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const pw  = form.get('password')?.value;
    const cpw = form.get('confirmPassword')?.value;
    return pw === cpw ? null : { passwordMismatch: true };
  }

  get firstName()       { return this.addForm.get('firstName'); }
  get lastName()        { return this.addForm.get('lastName'); }
  get email()           { return this.addForm.get('email'); }
  get password()        { return this.addForm.get('password'); }
  get confirmPassword() { return this.addForm.get('confirmPassword'); }
  get institution()     { return this.addForm.get('institution'); }
  get country()         { return this.addForm.get('country'); }

  close(): void { this.closed.emit(); }

  onSubmit(): void {
    if (this.addForm.invalid) { this.addForm.markAllAsTouched(); return; }

    this.isLoading = true;
    this.authService.register(this.addForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({ icon: 'success', title: 'User created!', timer: 1500, showConfirmButton: false });
        this.created.emit();
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', err.error?.message || 'Failed to create user.', 'error');
      }
    });
  }
}