import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ResearchPaperService } from 'app/services/research-paper.service';
import { faCheck , faXmark } from '@fortawesome/free-solid-svg-icons';

const PAPER_CATEGORIES = ['ARTIFICIAL_INTELLIGENCE','MACHINE_LEARNING','BIOLOGY','CHEMISTRY',
  'PHYSICS','MATHEMATICS','ENGINEERING','MEDICINE','SOCIAL_SCIENCES','OTHER'];

const DOMAINS = ['Computer Science','Life Sciences','Physical Sciences',
  'Social Sciences','Humanities','Engineering','Medicine','Business'];

@Component({
  selector: 'app-edit-paper-modal',
  templateUrl: './edit-paper-modal.component.html',
  styleUrls: ['./edit-paper-modal.component.css']
})
export class EditPaperModalComponent implements OnInit {

  @Input() paper: any;
  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<any>();

  faCheck = faCheck;
  faXmark = faXmark;

  editForm: FormGroup;
  isLoading = false;

  categories = PAPER_CATEGORIES;
  domains = DOMAINS;

  keywords: string[] = [];
  newKeyword = '';

  selectedDocument: File | null = null;
  selectedThumbnail: File | null = null;
  thumbnailPreviewUrl: string | null = null;

  constructor(private fb: FormBuilder, private paperService: ResearchPaperService) {
    this.editForm = this.fb.group({
      title:           ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      abstractText:    ['', [Validators.required, Validators.minLength(50), Validators.maxLength(5000)]],
      category:        ['', Validators.required],
      domainName:      ['', Validators.required],
      publicationDate: ['']
    });
  }

  ngOnInit(): void {
    if (this.paper) {
      this.editForm.patchValue({
        title:           this.paper.title           || '',
        abstractText:    this.paper.abstractText     || '',
        category:        this.paper.category         || '',
        domainName:      this.paper.domainName       || '',
        publicationDate: this.paper.publicationDate  || ''
      });
      this.keywords = [...(this.paper.keywords || [])];
      if (this.paper.thumbnailUrl) {
        this.thumbnailPreviewUrl = this.getFileUrl(this.paper.thumbnailUrl);
      }
    }
  }
  getFileUrl(fullPath: string): string {
    if (!fullPath) return '';
    const filename = fullPath.split('\\').pop()?.split('/').pop() || '';
    return `http://localhost:8080/api/v1/files/${filename}`;
  }

  get title()           { return this.editForm.get('title'); }
  get abstractText()    { return this.editForm.get('abstractText'); }
  get category()        { return this.editForm.get('category'); }
  get domainName()      { return this.editForm.get('domainName'); }
  get publicationDate() { return this.editForm.get('publicationDate'); }

  addKeyword(): void {
    const kw = this.newKeyword.trim();
    if (kw && !this.keywords.includes(kw)) {
      this.keywords.push(kw);
      this.newKeyword = '';
    }
  }

  removeKeyword(kw: string): void {
    this.keywords = this.keywords.filter(k => k !== kw);
  }

  onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        Swal.fire('Invalid file', 'Only PDF files are allowed.', 'error');
        return;
      }
      this.selectedDocument = file;
    }
  }

  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        Swal.fire('Invalid file', 'Only image files are allowed.', 'error');
        return;
      }
      this.selectedThumbnail = file;
      this.thumbnailPreviewUrl = URL.createObjectURL(file);
    }
  }

  close(): void { this.closed.emit(); }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('title',           this.editForm.value.title);
    formData.append('abstractText',    this.editForm.value.abstractText);
    formData.append('category',        this.editForm.value.category);
    formData.append('domainName',      this.editForm.value.domainName);
    if (this.editForm.value.publicationDate) {
      formData.append('publicationDate', this.editForm.value.publicationDate);
    }
    this.keywords.forEach(kw => formData.append('keywords', kw));
    if (this.selectedDocument)  formData.append('document',  this.selectedDocument);
    if (this.selectedThumbnail) formData.append('thumbnail', this.selectedThumbnail);

    this.paperService.updateResearchPaper(this.paper.id, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire({ icon: 'success', title: 'Paper updated!', timer: 1500, showConfirmButton: false });
        this.updated.emit(response);
        this.close();
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire('Error', error.error?.message || 'Failed to update paper.', 'error');
      }
    });
  }
  approvePaper(){
    this.paperService.validateResearchPaper(this.paper.id).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Paper approved!', timer: 1500, showConfirmButton: false });
        this.updated.emit();
        this.close();
      },
      error: (error) => {
        Swal.fire('Error', error.error?.message || 'Failed to approve paper.', 'error');
      }
    });
  }

  rejectPaper(){
    this.paperService.rejectResearchPaper(this.paper.id).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Paper rejected!', timer: 1500, showConfirmButton: false });
        this.updated.emit();
        this.close();
      },
      error: (error) => {
        Swal.fire('Error', error.error?.message || 'Failed to reject paper.', 'error');
      }
    });
  }
}