import { Component, OnInit } from '@angular/core';
import { faUser, faEnvelope, faBuilding, faMapMarkerAlt, 
         faBookOpen, faQuoteLeft, faEdit, faKey ,
          faGlobe, faFileAlt, faCalendarAlt,
         faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { UserService } from 'app/services/user.service';
import { ResearchPaperResponse, ResearchPaperService } from 'app/services/research-paper.service';


interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  country: string;
  bio: string;
  imageUrl: string | null;
  papersCount: number;
  citationCount: number;
  createdAt: string;
}

interface Paper {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  citations: number;
  abstract: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class    UserProfileComponent implements OnInit {
  // Icons
  faUser = faUser;
  faEnvelope = faEnvelope;
  faBuilding = faBuilding;
  faMapMarkerAlt = faMapMarkerAlt;
  faBookOpen = faBookOpen;
  faQuoteLeft = faQuoteLeft;
  faEdit = faEdit;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faGlobe = faGlobe;
  faFileAlt = faFileAlt;
  faCalendarAlt = faCalendarAlt;
  faChartLine = faChartLine;
  faUsers = faUsers;
  faKey = faKey;

  profile: UserProfile | undefined;

  recentPapers: ResearchPaperResponse[] = [];
  papersPublished: number = 0;
  currentUser: any;
  isLoading = true;
  showEditModal = false;


  constructor(private userService: UserService, private paperService: ResearchPaperService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadRecentPapers();
  }
  loadRecentPapers(): void {
  this.paperService.getResearchPaperByUserId('currentUserId').subscribe(papers=>{
      console.log('Fetched papers:', papers);
      this.recentPapers = papers
      this.papersPublished = papers.length;
  });
  }    
  loadUserData(): void {
    this.userService.getCurrentUser().subscribe(user => {
      console.log('Fetched user data:', user);
      this.currentUser = user;
      this.profile = {
        firstName: user.firstName,
        lastName: user.lastName,    
        email: user.email,
        institution: user.institution,
        country: user.country,
        bio: user.bio,
        imageUrl: user.imageUrl,
        papersCount: user.papersCount,
        citationCount: user.citationCount,        
        createdAt: new Date(user.createdAt).toLocaleDateString(),
      };
    });
    
    this.isLoading = false;
  }

  onProfileUpdated(updatedUser: any): void {
  this.currentUser = { ...this.currentUser, ...updatedUser };
}
}