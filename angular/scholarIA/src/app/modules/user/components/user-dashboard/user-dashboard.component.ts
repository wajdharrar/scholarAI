import { Component, OnInit } from '@angular/core';
import { faUser, faBookOpen, faNewspaper, faUsers, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import User from 'app/interfaces/User';
import AppEvent from 'app/interfaces/Event';
import { UserService } from '../../../../services/user.service'
import { ResearchPaperResponse, ResearchPaperService } from 'app/services/research-paper.service';
import {  faThumbsUp, faComment, faDownload, faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { LikeService } from 'app/services/like.service';
import { CommentService } from 'app/services/comment.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
export interface ModerationResponse {
  content: string;
  is_spam_or_toxic: boolean;
  action: 'REJECT' | 'APPROVE';
  reason: string;
}
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})

export class UserDashboardComponent implements OnInit{
  faUser = faUser;
  faBookOpen = faBookOpen;
  faNewspaper = faNewspaper;
  faUsers = faUsers;
  faCalendarAlt = faCalendarAlt;
  faThumbsUp = faThumbsUp;
  faComment = faComment;
  faDownload = faDownload;
  faQuoteRight = faQuoteRight;
  papers:ResearchPaperResponse[] = [];
  filteredPapers: ResearchPaperResponse[] = [];
  toxic:boolean=false;
  message:string='';

  userData: User = {
    firstName: '',
    lastName: '',
    institution: '',
    imageUrl:'' ,
    email: '',
    country: '',
    bio: '',  
    createdAt: '',
    papersCount: 0,
    citationCount: 0
  };

  upcomingEvents: AppEvent[] = [
    {
      id: 1,
      title: 'International Conference on AI in Healthcare',
      date: 'May 10, 2025',
      event_type: 'Conference',
      attendees: 1250
    },
    {
      id: 2,
      title: 'Workshop: Deep Learning for Genomics',
      date: 'Jun 5, 2025',
      event_type: 'Workshop',
      attendees: 340
    },
    {
      id: 3,
      title: 'Summer School on Climate Modeling',
      date: 'Jul 20, 2025',
      event_type: 'Summer School',
      attendees: 580
    }
  ];

  trendingTopics: string[] = [
    '#MachineLearning',
    '#Neuroscience',
    '#ClimateChange',
    '#Bioengineering',
    '#QuantumComputing'
  ];

  constructor(
    private userService: UserService,
    private researchPaperService: ResearchPaperService,
    private likeService: LikeService,
    private commentService: CommentService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const response=this.userService.getCurrentUser();
    response.subscribe(user => {
      this.userData = user;
      console.log('User data fetched successfully:', user);
    });
    console.log('Fetching user data...');
    this.loadPapers();
  }
  loadPapers(): void {  
    this.researchPaperService.getRecommendationResearchPapers().subscribe(papers => {
      this.papers = papers;
      this.filteredPapers = papers.filter(paper => paper.status === 'PUBLISHED');
      console.log('Filtered research papers fetched successfully:', this.filteredPapers);
      this.filteredPapers.forEach(p => {
        if (p.document) {
          p.document = this.getFileUrl(p.document);
        }
        if (p.thumbnailUrl) {
          p.thumbnailUrl = this.getFileUrl(p.thumbnailUrl);
        }
        this.commentService.getAllCommentsByPaperId(p.id).subscribe(comments => {
          p.comments = comments;
          console.log(`Comments for paper ${p.id} fetched successfully:`, comments);
        });

      });
      console.log('Research papers fetched successfully:', papers);

    });
  }
  getFileUrl(fullPath: string): string {
    if (!fullPath) return '';
    const filename = fullPath.split('\\').pop()?.split('/').pop() || '';
      return `http://localhost:8080/api/v1/files/${filename}`;
  }
  viewPaper(id: string): void {
    const paper = this.papers.find(p => p.id === id);
    if (paper?.document) {
      window.open(this.getFileUrl(paper.document), '_blank');
    }
  }
  getAuthorCount(count: number): string {
    return count === 1 ? '1 author' : `${count} authors`;
  }

  // Helper to format event date (if needed)
  getEventDay(dateStr: string): string {
    const parts = dateStr.split(' ');
    return parts[1]?.replace(',', '') || '';
  }

  getEventMonth(dateStr: string): string {
    return dateStr.split(' ')[0] || '';
  }
  onLike(researchPaperId: string): void {
    console.log(`Liked paper with ID: ${researchPaperId}`);
    this.likeService.addLike({ researchPaperId }).subscribe({
      next: () => {
        console.log('Like added successfully');
        this.loadPapers();
      },
      error: (err) => {
        console.error('Error adding like:', err);
      }
    });
  }
  // 1. Declare tracking variables in your class properties
  activeCommentPaperId: string | null = null;
  newCommentText: string = '';

  // 2. Add methods to handle interaction logic
  toggleComments(paperId: string): void {
    // If clicking the comment button again on the active card, close it
    if (this.activeCommentPaperId === paperId) {
      this.activeCommentPaperId = null;
      this.newCommentText = '';
    } else {
      this.activeCommentPaperId = paperId;
      this.newCommentText = ''; // Flush state for next post
    }
  }
  checkComment(text: string): Observable<ModerationResponse> {
    return this.http.post<ModerationResponse>('http://localhost:8000/v1/filter-comment', { content: text });
  }

  submitComment(researchPaperId: string): void {
    if (!this.newCommentText.trim()) return;

    // 1. Run the moderation check first
    this.checkComment(this.newCommentText).subscribe({
      next: (response) => {
        console.log('Moderation response:', response);
        this.toxic = response.is_spam_or_toxic;
        this.message = response.reason;

        // 2. NOW check if it's toxic, inside the asynchronous callback
        if (this.toxic) {
          Swal.fire({
            icon: 'error',
            title: 'Comment Rejected', 
            text: this.message,
          });
          // Optional: Clear the input text even if rejected, or leave it so they can edit?
          // this.newCommentText = ''; 
        } else {
          // 3. If safe, proceed to add the comment
          this.commentService.addComment({ content: this.newCommentText, researchPaperId }).subscribe({
            next: () => {
              console.log('Comment added successfully'); 
              this.loadPapers();
              this.newCommentText = ''; // Clear input only on success
              
              // Fetch updated comments
              this.commentService.getAllCommentsByPaperId(researchPaperId).subscribe(comments => {
                const paper = this.filteredPapers.find(p => p.id === researchPaperId);
                if (paper) {
                  paper.comments = comments;
                }
              });
            },
            error: (err) => { 
              console.error('Error adding comment:', err);
            }
          });    
        }
      },
      error: (err) => {
        console.error('Moderation check failed:', err);
      }
    });
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  onDownload(paperId: string): void {
    console.log(`Downloaded paper with ID: ${paperId}`);
  }
  onOpenPaper(id: string | undefined): void {
    const paper = this.papers.find(p => p.id === id);
    if (paper?.document) {
      window.open(this.getFileUrl(paper.document), '_blank');
    }
  }
}
