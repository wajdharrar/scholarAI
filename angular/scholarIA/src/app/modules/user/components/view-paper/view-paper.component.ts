import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faFileAlt, faUser, faEye, faThumbsUp, faComment, faDownload, faQuoteRight, faTag, faBookOpen, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { ResearchPaperResponse, ResearchPaperService } from 'app/services/research-paper.service';

export interface ResearchPaper {
  id: string;
  title: string;
  abstractText: string;
  thumbnailUrl?: string;
  category: string;
  fileType: string;
  document: string;        // URL or base64
  fileSize: number;
  authorIds: string[];
  keywords: string[];
  commentCount: number;
  likesCount: number;
  downloadsCount: number;
  citations: number;
}

@Component({
  selector: 'app-view-paper',
  templateUrl: './view-paper.component.html',
  styleUrls: ['./view-paper.component.css']
})
export class ViewPaperComponent {
  // Icons
  faFileAlt = faFileAlt;
  faUser = faUser;
  faEye = faEye;
  faThumbsUp = faThumbsUp;
  faComment = faComment;
  faDownload = faDownload;
  faQuoteRight = faQuoteRight;
  faTag = faTag;
  faBookOpen = faBookOpen;
  faSearch = faSearch;
  faFilter = faFilter;

  papers: ResearchPaperResponse[] = [];
  filteredPapers: ResearchPaperResponse[] = [];
  isLoading = true;
  searchTerm = '';
  selectedCategory = 'all';
  categories: string[] = [];

  constructor(private router: Router, private researchPaperService: ResearchPaperService) {}

  ngOnInit(): void {
    this.loadPapers();
  }

  loadPapers(): void {
    setTimeout(() => {                
    this.loadPapersFromService();
    }, 1000);
  }


  loadPapersFromService(): void {
  this.researchPaperService.getResearchPaperByUserId('currentUserId').subscribe({
    next: (response) => {
      console.log('Fetched papers:', response);
      this.papers = response;
      this.filteredPapers = response;
      this.categories = Array.from(new Set(response.map(p => p.category))); 
      this.papers.forEach(p => {
        if (p.document) {
          p.document = this.getFileUrl(p.document);
        }
        if (p.thumbnailUrl) {
          p.thumbnailUrl = this.getFileUrl(p.thumbnailUrl);
        }
      });
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error fetching papers:', error);
      this.papers = [];
    }
  });
}
getFileUrl(fullPath: string): string {
  if (!fullPath) return '';
  const filename = fullPath.split('\\').pop()?.split('/').pop() || '';
     return `http://localhost:8080/api/v1/files/${filename}`;
}

  filterPapers(): void {
    let filtered = this.papers;
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.abstractText?.toLowerCase().includes(term) ||
        p.keywords?.some(k => k.toLowerCase().includes(term))
    );
    }
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    this.filteredPapers = filtered;
  }

  onSearchChange(): void {
    this.filterPapers();
  }

  onCategoryChange(): void {
    this.filterPapers();
  }

  viewPaper(paperId: string): void {
    this.router.navigate(['/papers', paperId]);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  getAuthorCount(count: number): string {
    return count === 1 ? '1 author' : `${count} authors`;
  }
}
