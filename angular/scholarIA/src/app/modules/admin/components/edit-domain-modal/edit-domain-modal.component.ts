import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-domain-modal',
  templateUrl: './edit-domain-modal.component.html',
  styleUrls: ['./edit-domain-modal.component.css']
})
export class EditDomainModalComponent implements OnInit {

  @Input() domain: any;
  @Output() closed  = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  editForm: FormGroup;
  isLoading  = false;
  logoPreview: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      logo: ['', Validators.required]
    });

    this.editForm.get('logo')?.valueChanges.subscribe(url => {
      this.logoPreview = url || null;
    });
  }

  ngOnInit(): void {
    if (this.domain) {
      this.editForm.patchValue({
        name: this.domain.name || '',
        logo: this.domain.logo || ''
      });
      this.logoPreview = this.domain.logo || null;
    }
  }

  get name() { return this.editForm.get('name'); }
  get logo() { return this.editForm.get('logo'); }

  close(): void { this.closed.emit(); }

  onSubmit(): void {
    if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }

    this.isLoading = true;
    this.http.put(`/api/v1/domains/${this.domain.id}`, this.editForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({ icon: 'success', title: 'Domain updated!', timer: 1500, showConfirmButton: false });
        this.updated.emit();
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', err.error?.message || 'Failed to update domain.', 'error');
      }
    });
  }
}