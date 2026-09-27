import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ResearchPaperService } from 'app/services/research-paper.service';

const PAPER_CATEGORIES = ['ARTIFICIAL_INTELLIGENCE','MACHINE_LEARNING','BIOLOGY','CHEMISTRY',
  'PHYSICS','MATHEMATICS','ENGINEERING','MEDICINE','SOCIAL_SCIENCES','OTHER'];

const DOMAINS = ['Computer Science','Life Sciences','Physical Sciences',
  'Social Sciences','Humanities','Engineering','Medicine','Business'];

@Component({
  selector: 'app-add-paper-modal',
  templateUrl: './add-paper-modal.component.html',
  styleUrls: ['./add-paper-modal.component.css']
})
export class AddPaperModalComponent {

  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  addForm: FormGroup;
  isLoading = false;

  categories = PAPER_CATEGORIES;
  domains = DOMAINS;

  keywords: string[] = [];
  newKeyword = '';

  registeredAuthors: { id: string; name: string; email: string }[] = [];
  guestAuthors: string[] = [];
  authorSearch = '';
  searchResults: { id: string; name: string; email: string }[] = [];
  showDropdown = false;

  selectedDocument: File | null = null;
  selectedThumbnail: File | null = null;
  thumbnailPreviewUrl: string | null = null;

  constructor(private fb: FormBuilder, private paperService: ResearchPaperService, private http: HttpClient) {
    this.addForm = this.fb.group({
      title:           ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      abstractText:    ['', [Validators.required, Validators.minLength(50), Validators.maxLength(5000)]],
      category:        ['', Validators.required],
      domainName:      ['', Validators.required],
      publicationDate: ['', Validators.required]
    });
  }

  get title()           { return this.addForm.get('title'); }
  get abstractText()    { return this.addForm.get('abstractText'); }
  get category()        { return this.addForm.get('category'); }
  get domainName()      { return this.addForm.get('domainName'); }
  get publicationDate() { return this.addForm.get('publicationDate'); }

  // Keywords
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

  // Authors
  searchAuthors(): void {
    const q = this.authorSearch.trim();
    if (q.length < 2) { this.searchResults = []; this.showDropdown = false; return; }
    this.http.get<any[]>(`http://localhost:8080/api/v1/users/search?q=${encodeURIComponent(q)}`).subscribe({
      next: results => {
        this.searchResults = results.map(u => ({
          id: u.id,
          name: u.fullName,
          email: u.email
        }));
        this.showDropdown = true;
      },
      error: () => { this.searchResults = []; this.showDropdown = true; }
    });
  }

  addRegisteredAuthor(user: { id: string; name: string; email: string }): void {
    if (!this.registeredAuthors.find(a => a.id === user.id)) {
      this.registeredAuthors.push(user);
    }
    this.authorSearch = '';
    this.showDropdown = false;
  }

  addGuestAuthor(): void {
    const name = this.authorSearch.trim();
    if (name && !this.guestAuthors.includes(name)) {
      this.guestAuthors.push(name);
    }
    this.authorSearch = '';
    this.showDropdown = false;
  }

  removeRegisteredAuthor(id: string): void {
    this.registeredAuthors = this.registeredAuthors.filter(a => a.id !== id);
  }

  removeGuestAuthor(name: string): void {
    this.guestAuthors = this.guestAuthors.filter(g => g !== name);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  // Files
  onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        Swal.fire('Invalid file', 'Only PDF files are allowed.', 'error');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire('File too large', 'Maximum file size is 10MB.', 'error');
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
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('File too large', 'Maximum image size is 2MB.', 'error');
        return;
      }
      this.selectedThumbnail = file;
      this.thumbnailPreviewUrl = URL.createObjectURL(file);
    }
  }

  close(): void { this.closed.emit(); }

  onSubmit(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    if (!this.selectedDocument) {
      Swal.fire('Missing document', 'Please upload the research paper PDF.', 'warning');
      return;
    }
    if (this.keywords.length === 0) {
      Swal.fire('Missing keywords', 'Please add at least one keyword.', 'warning');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('title',           this.addForm.value.title);
    formData.append('abstractText',    this.addForm.value.abstractText);
    formData.append('category',        this.addForm.value.category);
    formData.append('domainName',      this.addForm.value.domainName);
    formData.append('publicationDate', this.addForm.value.publicationDate);
    this.keywords.forEach(kw         => formData.append('keywords',     kw));
    this.registeredAuthors.forEach(a => formData.append('authorIds',    a.id));
    this.guestAuthors.forEach(g      => formData.append('guestAuthors', g));
    formData.append('document', this.selectedDocument);
    if (this.selectedThumbnail) formData.append('thumbnail', this.selectedThumbnail);

    this.paperService.addResearchPaper(formData).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({ icon: 'success', title: 'Paper added!', timer: 1500, showConfirmButton: false });
        this.created.emit();
        this.close();
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire('Error', error.error?.message || 'Failed to add paper.', 'error');
      }
    });
  }
}