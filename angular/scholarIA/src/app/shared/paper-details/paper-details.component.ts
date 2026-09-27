import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import {
  faArrowLeft,
  faDownload,
  faThumbsUp,
  faBookmark,
  faQuoteRight,
  faComment,
  faEye,
  faTag,
  faUser,
  faFileAlt,
  faCalendarAlt,
  faShare
} from '@fortawesome/free-solid-svg-icons';

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
  authorNames?: string[];   // optional, for display
  keywords: Set<string>;
  commentCount: number;
  likesCount: number;
  downloadsCount: number;
  citations: number;
  publicationDate?: Date;
}

@Component({
  selector: 'app-paper-details',
  templateUrl: './paper-details.component.html',
  styleUrls: ['./paper-details.component.css']
})
export class PaperDetailsComponent implements OnInit {
  // Icons
  faArrowLeft = faArrowLeft;
  faDownload = faDownload;
  faThumbsUp = faThumbsUp;
  faBookmark = faBookmark;
  faQuoteRight = faQuoteRight;
  faComment = faComment;
  faEye = faEye;
  faTag = faTag;
  faUser = faUser;
  faFileAlt = faFileAlt;
  faCalendarAlt = faCalendarAlt;
  faShare = faShare;

  paper: ResearchPaper | null = null;
  isLoading = true;
  isLiked = false;
  isSaved = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const paperId = this.route.snapshot.paramMap.get('id');
    if (paperId) {
      this.loadPaperDetails(paperId);
    } else {
      this.router.navigate(['/papers']);
    }
  }

  loadPaperDetails(id: string): void {
    // Mock API call – replace with your actual service
    setTimeout(() => {
      this.paper = this.getMockPaper(id);
      if (!this.paper) {
        Swal.fire('Error', 'Paper not found', 'error').then(() => {
          this.router.navigate(['/papers']);
        });
        return;
      }
      this.isLoading = false;
    }, 500);
  }

  getMockPaper(id: string): ResearchPaper {
    // Simulate fetching by ID – normally from a service
    return {
      id: id,
      title: 'Deep Learning for Cancer Detection',
      abstractText: 'We present a novel deep learning architecture that achieves 98% accuracy in detecting early-stage lung cancer from CT scans. Our method combines convolutional neural networks with attention mechanisms to highlight suspicious regions. Evaluated on a dataset of 10,000 scans, the model outperforms existing approaches by 15% in sensitivity while maintaining high specificity. This work has implications for improving early diagnosis and reducing false positives in clinical settings.',
      thumbnailUrl: 'https://picsum.photos/id/1/800/400',
      category: 'Artificial Intelligence',
      fileType: 'PDF',
      document: 'https://example.com/paper.pdf',
      fileSize: 2.5 * 1024 * 1024,
      authorIds: ['user1', 'user2'],
      authorNames: ['Dr. Sarah Chen', 'Prof. James Wilson'],
      keywords: new Set(['deep learning', 'cancer detection', 'medical imaging', 'CNN', 'attention mechanism']),
      commentCount: 12,
      likesCount: 45,
      downloadsCount: 230,
      citations: 18,
      publicationDate: new Date(2024, 5, 15)
    };
  }

  goBack(): void {
    this.location.back();
  }

  downloadPaper(): void {
    if (this.paper?.document) {
      // Simulate download – open URL or trigger file download
      window.open(this.paper.document, '_blank');
      Swal.fire('Download started', 'Your paper is being downloaded.', 'success');
    }
  }

  toggleLike(): void {
    this.isLiked = !this.isLiked;
    if (this.isLiked) {
      this.paper!.likesCount++;
      Swal.fire('Liked!', 'You liked this paper.', 'success');
    } else {
      this.paper!.likesCount--;
      Swal.fire('Unliked', 'You removed your like.', 'info');
    }
  }

  toggleSave(): void {
    this.isSaved = !this.isSaved;
    Swal.fire(
      this.isSaved ? 'Saved' : 'Removed',
      this.isSaved ? 'Paper saved to your collection.' : 'Paper removed from saved.',
      'success'
    );
  }

  sharePaper(): void {
    if (navigator.share) {
      navigator.share({
        title: this.paper?.title,
        text: 'Check out this research paper!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire('Link copied', 'Paper link copied to clipboard.', 'success');
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}