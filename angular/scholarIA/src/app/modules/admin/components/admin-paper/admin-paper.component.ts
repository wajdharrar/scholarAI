import { Component } from '@angular/core';
import { faSearch, faFilter, faPlus, faDownload, faEllipsisVertical, faChevronLeft, faChevronRight, faEye, faEdit, faTrash, faRefresh, faTag, faStar, faCalendar, faCheckCircle, faXmarkCircle, IconDefinition, faSort, faSortUp, faSortDown, faClock, faFileLines, faFilePdf, faFileWord } from '@fortawesome/free-solid-svg-icons';
import { ResearchPaperResponse, ResearchPaperService } from 'app/services/research-paper.service';

export interface Paper {
  id: number;
  title: string;
  authors: string;
  correspondingAuthor: string;
  journal: string;
  category: string;
  status: string;
  views: number;
  downloads: number;
  citations: number;
  rating: string;
  publishedDate: string;
  lastUpdated: string;
  fileType: string;
  fileSize: string;
  doi: string;
}
 
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-admin-paper',
  templateUrl: './admin-paper.component.html',
  styleUrls: ['./admin-paper.component.css']
})
export class AdminPaperComponent {
// Icons
  faSearch = faSearch;
  faFilter = faFilter;
  faPlus = faPlus;
  faDownload = faDownload;
  faEllipsisVertical = faEllipsisVertical;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faRefresh = faRefresh;
  faTag = faTag;
  faStar = faStar;
  faCalendar = faCalendar;
  faCheckCircle = faCheckCircle;
  faXmarkCircle = faXmarkCircle;
 
  papers: ResearchPaperResponse[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortConfig: SortConfig = { key: 'title', direction: 'asc' };
  selectedFilter = 'all';
  selectedCategory = 'all';
  showFilterMenu = false;
  showCategoryMenu = false;
  selectedPapers: string[] = [];
  showEditModal = false;
  selectedPaper: any = null;
 
  statusFilters = ['all', 'PUBLISHED', 'DRAFT', 'REJECTED'];
  showAddModal: boolean = false;
  constructor(private paperService: ResearchPaperService) {}
  ngOnInit(): void {
    this.generatePapers();
  }
 
  private generatePapers(){
    this.paperService.getAllResearchPapers().subscribe({
      next: (papers) => {
        this.papers = papers;
        console.log('Loaded papers:', this.papers);
      },
      error: (err) => {
        console.error('Error loading papers:', err);
      }
    });
  }
 
  // ── Computed getters ──────────────────────────────────────────
 
  get categories(): string[] {
    const unique = [...new Set(this.papers.map(p => p.category))];
    return ['all', ...unique];
  }
 
  get publishedCount(): number {
    return this.papers.filter(p => p.status === 'PUBLISHED').length;
  }
 
  get underReviewCount(): number {
    return this.papers.filter(p => p.status === 'DRAFT').length;
  }
  get rejectedCount(): number {
    return this.papers.filter(p => p.status === 'REJECTED').length;
  }
 
 
  get totalDownloads(): number {
    return this.papers.reduce((acc, p) => acc + p.downloadsCount, 0);
  }
 
  get filteredPapers(): ResearchPaperResponse[] {
    return this.papers.filter(paper => {
      const term = this.searchTerm.toLowerCase();
      const matchesSearch =
        paper.title.toLowerCase().includes(term) ||
        paper.authorIds?.some(id => id.toLowerCase().includes(term)) 
      const matchesStatus = this.selectedFilter === 'all' || paper.status === this.selectedFilter;
      const matchesCategory = this.selectedCategory === 'all' || paper.category === this.selectedCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }
 
  get sortedPapers(): ResearchPaperResponse[] {
    return [...this.filteredPapers].sort((a, b) => {
      const aVal = a[this.sortConfig.key as keyof ResearchPaperResponse];
      const bVal = b[this.sortConfig.key as keyof ResearchPaperResponse];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return this.sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return this.sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }
 
  get totalPages(): number {
    return Math.ceil(this.sortedPapers.length / this.itemsPerPage);
  }
 
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }
 
  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.sortedPapers.length);
  }
 
  get paginatedPapers(): ResearchPaperResponse[] {
    return this.sortedPapers.slice(this.startIndex, this.startIndex + this.itemsPerPage);
  }
 
  get hasActiveFilters(): boolean {
    return this.selectedFilter !== 'all' || this.selectedCategory !== 'all';
  }
 
  // ── Sorting ───────────────────────────────────────────────────
 
  setSort(key: string): void {
    this.sortConfig = {
      key,
      direction: this.sortConfig.key === key && this.sortConfig.direction === 'asc' ? 'desc' : 'asc'
    };
  }
 
  getSortIcon(key: string): IconDefinition {
    if (this.sortConfig.key !== key) return faSort;
    return this.sortConfig.direction === 'asc' ? faSortUp : faSortDown;
  }
 
  // ── Selection ─────────────────────────────────────────────────
 
  isAllSelected(): boolean {
    return this.paginatedPapers.length > 0 &&
      this.paginatedPapers.every(p => this.selectedPapers.includes(p.id));
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedPapers = [];
    } else {
      this.selectedPapers = this.paginatedPapers.map(p => p.id);
    }
  }
 
  toggleSelectPaper(id: string): void {
    this.selectedPapers = this.selectedPapers.includes(id)
      ? this.selectedPapers.filter(pid => pid !== id)
      : [...this.selectedPapers, id];
  }
 
  // ── Filters ───────────────────────────────────────────────────
 
  selectStatusFilter(filter: string): void {
    this.selectedFilter = filter;
    this.showFilterMenu = false;
    this.currentPage = 1;
  }
 
  selectCategoryFilter(category: string): void {
    this.selectedCategory = category;
    this.showCategoryMenu = false;
    this.currentPage = 1;
  }
 
  getPaperCountByStatus(status: string): number {
    return this.papers.filter(p => p.status === status).length;
  }
 
  getPaperCountByCategory(category: string): number {
    return this.papers.filter(p => p.category === category).length;
  }
 
  // ── Pagination ────────────────────────────────────────────────
 
  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
 
  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }
 
  goToPage(page: number): void {
    this.currentPage = page;
  }
 
  getPageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 5;
    let start = 1;
 
    if (total <= maxVisible) {
      start = 1;
    } else if (current <= 3) {
      start = 1;
    } else if (current >= total - 2) {
      start = total - maxVisible + 1;
    } else {
      start = current - 2;
    }
 
    return Array.from({ length: Math.min(maxVisible, total) }, (_, i) => start + i);
  }
 
  onItemsPerPageChange(value: string): void {
    this.itemsPerPage = Number(value);
    this.currentPage = 1;
  }
 
  // ── Styling helpers ───────────────────────────────────────────
 
  getStatusColor(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-700 border-green-200';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }
 
  getStatusIcon(status: string): IconDefinition {
    switch (status) {
      case 'PUBLISHED': return faCheckCircle;
      case 'DRAFT': return faClock;
      case 'REJECTED': return faXmarkCircle;
      default: return faFileLines;
    }
  }
 
  getFileIcon(fileType: string): IconDefinition {
    return fileType === 'pdf' ? faFilePdf : faFileWord;
  }
 
  getFileBgClass(fileType: string): string {
    return fileType === 'pdf' ? 'bg-red-100' : 'bg-blue-100';
  }
 
  getFileIconClass(fileType: string): string {
    return fileType === 'pdf' ? 'text-red-600' : 'text-blue-600';
  }
 
  formatStatus(status: string): string {
    return status.replace('_', ' ');
  }
 
  // ── Bulk actions ──────────────────────────────────────────────
 
 
  addPaper(): void {
    this.showAddModal = true;
  }

  onPaperCreated(): void {
    this.generatePapers();
  }
  refreshPapers(): void { this.generatePapers(); }
  viewPaper(id: string): void {
    const paper = this.papers.find(p => p.id === id);
    if (paper?.document) {
      window.open(this.getFileUrl(paper.document), '_blank');
    }
  }
  getFileUrl(fullPath: string): string {
    if (!fullPath) return '';
    const filename = fullPath.split('\\').pop()?.split('/').pop() || '';
    return `http://localhost:8080/api/v1/files/${filename}`;
  }
  editPaper(id: string): void { 
    this.selectedPaper = this.papers.find(p => p.id === id);
    this.showEditModal = true;
  }
  onPaperUpdated(updated: any): void {
    this.generatePapers(); // refresh the list
  }
  deletePaper(id: string): void { /* implement */ }
}
