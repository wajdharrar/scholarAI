import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faFileAlt, faTag, faCalendarAlt, faImage, faFilePdf, faPlus, faTrash, faSave,faInfoCircle, faSearch, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ResearchPaperService } from 'app/services/research-paper.service';
import Swal from 'sweetalert2';
const PAPER_CATEGORIES = [
  'ARTIFICIAL_INTELLIGENCE',
  'MACHINE_LEARNING',
  'BIOLOGY',
  'CHEMISTRY',
  'PHYSICS',
  'MATHEMATICS',
  'ENGINEERING',
  'MEDICINE',
  'SOCIOLOGY',
  'OTHER'
];

const DOMAINS = [
  'Computer Science',
  'Life Sciences',
  'Physical Sciences',
  'Social Sciences',
  'Humanities',
  'Engineering',
  'Medicine',
  'Business',
  'Economics'
];
@Component({
  selector: 'app-create-paper',
  templateUrl: './create-paper.component.html',
  styleUrls: ['./create-paper.component.css']
})
export class CreatePaperComponent {
  // Icons
  faFileAlt = faFileAlt;
  faTag = faTag;
  faCalendarAlt = faCalendarAlt;
  faImage = faImage;
  faFilePdf = faFilePdf;
  faPlus = faPlus;
  faTrash = faTrash;
  faSave = faSave;
  faInfoCircle = faInfoCircle;
  faSearch = faSearch;
  faUser = faUser;
  faXmark = faXmark;

  publishForm: FormGroup;
  isLoading = false;

  // Dynamic keyword list
  keywords: string[] = [];
  newKeyword = '';

  // Available options
  categories = PAPER_CATEGORIES;
  domains = DOMAINS;

  // File references
  selectedDocument: File | null = null;
  selectedThumbnail: File | null = null;
  documentPreviewUrl: string | null = null;
  thumbnailPreviewUrl: string | null = null;

  // Author management
  registeredAuthors: { id: string; name: string; email: string }[] = [];
  guestAuthors: string[] = [];
  authorSearch = '';
  searchResults: { id: string; name: string; email: string }[] = [];
  showDropdown = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private paperService: ResearchPaperService,
  ) {
    this.publishForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      abstract: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(5000)]],
      publicationDate: ['', Validators.required],
      category: ['', Validators.required],
      domain: ['', Validators.required],
      // keywords handled separately
    });
  }

  ngOnInit(): void {}

  // Convenience getters
  get title() { return this.publishForm.get('title'); }
  get abstract() { return this.publishForm.get('abstract'); }
  get publicationDate() { return this.publishForm.get('publicationDate'); }
  get category() { return this.publishForm.get('category'); }
  get domain() { return this.publishForm.get('domain'); }



  searchAuthors(): void {
  const q = this.authorSearch.trim();
  if (q.length < 2) { 
    this.searchResults = []; 
    this.showDropdown = false; 
    return; 
  }
  this.http.get<any[]>(`http://localhost:8080/api/v1/users/search?q=${encodeURIComponent(q)}`).subscribe({
    next: results => {
      // Map firstName + lastName → name
      this.searchResults = results.map(u => ({
        id: u.id,
        name: u.fullName,   // ← match the exact field name from your API
        email: u.email
      }));
      this.showDropdown = true;
    },
    error: () => { 
      this.searchResults = []; 
      this.showDropdown = true; 
    }
  });
}

  addRegisteredAuthor(user: { id: string; name: string; email: string }): void {
    if (!this.registeredAuthors.find(a => a.id === user.id)) {
      this.registeredAuthors.push(user);
    }
    this.authorSearch = '';
    this.showDropdown = false;
  }
  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
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

  // Keyword management
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

  // File handling
  onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
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
      this.documentPreviewUrl = URL.createObjectURL(file);
    }
  }

  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
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

  removeDocument(): void {
    this.selectedDocument = null;
    if (this.documentPreviewUrl) {
      URL.revokeObjectURL(this.documentPreviewUrl);
      this.documentPreviewUrl = null;
    }
  }

  removeThumbnail(): void {
    this.selectedThumbnail = null;
    if (this.thumbnailPreviewUrl) {
      URL.revokeObjectURL(this.thumbnailPreviewUrl);
      this.thumbnailPreviewUrl = null;
    }
  }

  onSubmit(): void {
    if (this.publishForm.invalid) {
      Object.keys(this.publishForm.controls).forEach(key => {
        const control = this.publishForm.get(key);
        control?.markAsTouched();
      });
      Swal.fire('Incomplete form', 'Please fill all required fields correctly.', 'warning');
      return;
    }

    if (!this.selectedDocument) {
      Swal.fire('Missing document', 'Please upload the research paper (PDF).', 'warning');
      return;
    }

    if (this.keywords.length === 0) {
      Swal.fire('Missing keywords', 'Please add at least one keyword.', 'warning');
      return;
    }

    this.isLoading = true;

    // Prepare FormData for multipart upload
    const formData = new FormData();
    this.registeredAuthors.forEach(a => formData.append('authorIds', a.id));
    this.guestAuthors.forEach(g => formData.append('guestAuthors', g));
    formData.append('title', this.title!.value);
    formData.append('abstractText', this.abstract!.value);
    formData.append('domainName', this.domain!.value);    
    formData.append('publicationDate', this.publicationDate!.value);
    formData.append('category', this.category!.value);
    this.keywords.forEach(keyword => {
      formData.append('keywords', keyword);
    });
    formData.append('document', this.selectedDocument);
    if (this.selectedThumbnail) {
      formData.append('thumbnail', this.selectedThumbnail);
    }

    // Replace with your actual API endpoint
    this.paperService.addResearchPaper(formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Paper submitted!',
          text: 'Your research paper has been successfully published.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/user/dashboard']);
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
        Swal.fire('Error', error.error?.message || 'Failed to publish paper. Please try again.', 'error');
      }
    });
  }
}
