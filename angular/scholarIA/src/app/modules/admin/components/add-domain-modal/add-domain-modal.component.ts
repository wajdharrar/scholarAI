import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DomainService } from 'app/services/domain.service';

@Component({
  selector: 'app-add-domain-modal',
  templateUrl: './add-domain-modal.component.html',
  styleUrls: ['./add-domain-modal.component.css']
})
export class AddDomainModalComponent {

  @Output() closed  = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  addForm: FormGroup;
  isLoading = false;
  logoPreview: string | null = null;

  constructor(private fb: FormBuilder, private domainService: DomainService) {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      logo: ['', Validators.required]
    });

    // Live preview when URL changes
    this.addForm.get('logo')?.valueChanges.subscribe(url => {
      this.logoPreview = url || null;
    });
  }

  get name() { return this.addForm.get('name'); }
  get logo() { return this.addForm.get('logo'); }

  close(): void { this.closed.emit(); }

  onSubmit(): void {
    if (this.addForm.invalid) { this.addForm.markAllAsTouched(); return; }

    this.isLoading = true;
    this.domainService.addDomain(this.addForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({ icon: 'success', title: 'Domain created!', timer: 1500, showConfirmButton: false });
        this.created.emit();
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', err.error?.message || 'Failed to create domain.', 'error');
      }
    });
  }
}