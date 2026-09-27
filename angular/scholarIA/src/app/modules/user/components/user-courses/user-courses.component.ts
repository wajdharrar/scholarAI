import { Component, OnInit } from '@angular/core';
import { faFolderOpen, faFileAlt, faPlus, faUser, faCalendarAlt, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { Collection } from 'app/interfaces/Collection';

@Component({
  selector: 'app-user-courses',
  templateUrl: './user-courses.component.html',
  styleUrls: ['./user-courses.component.css']
})
export class UserCoursesComponent implements OnInit{
  // Icons
  faFolderOpen = faFolderOpen;
  faFileAlt = faFileAlt;
  faPlus = faPlus;
  faUser = faUser;
  faCalendarAlt = faCalendarAlt;
  faBookOpen = faBookOpen;

  collections: Collection[] = [];
  isLoading = true;

  constructor() {}

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    // Mock data – replace with API call or localStorage
    setTimeout(() => {
      this.collections = [
        {
          id: 1,
          name: 'Machine Learning in Healthcare',
          description: 'Recent advances in applying ML to medical diagnosis, drug discovery, and patient care.',
          papers: [
            { id: 101, title: 'Deep Learning for Cancer Detection', authors: 'Smith et al.', year: 2024, journal: 'Nature Medicine' },
            { id: 102, title: 'Transformers for Medical Imaging', authors: 'Lee & Kim', year: 2023, journal: 'IEEE TMI' },
            { id: 103, title: 'Federated Learning in Hospitals', authors: 'Johnson, Brown', year: 2024 }
          ],
          createdAt: new Date('2025-01-15')
        },
        {
          id: 2,
          name: 'Climate Science & Sustainability',
          description: 'Research on climate modeling, renewable energy, and sustainable practices.',
          papers: [
            { id: 201, title: 'AI for Weather Prediction', authors: 'Zhang et al.', year: 2024, journal: 'Climate Dynamics' },
            { id: 202, title: 'Carbon Capture Technologies', authors: 'Patel, Gupta', year: 2023 }
          ],
          createdAt: new Date('2025-02-10')
        },
        {
          id: 3,
          name: 'Quantum Computing Fundamentals',
          description: 'Introduction to quantum algorithms, error correction, and hardware developments.',
          papers: [
            { id: 301, title: 'Quantum Supremacy Explained', authors: 'Aaronson', year: 2024, journal: 'Quantum Info' },
            { id: 302, title: 'Topological Qubits', authors: 'Nayak et al.', year: 2023 }
          ],
          createdAt: new Date('2025-03-05')
        }
      ];
      this.isLoading = false;
    }, 500);
  }

  createNewCollection(): void {
    // Placeholder for creating a new collection
    console.log('Create new collection clicked');
    // Example: open a modal or navigate to create page
  }

  viewPaper(paperId: number): void {
    // Navigate to paper details
    console.log('View paper', paperId);
    // this.router.navigate(['/papers', paperId]);
  }

  openCollection(collectionId: number): void {
    // Navigate to collection details page
    console.log('Open collection', collectionId);
    // this.router.navigate(['/collections', collectionId]);
  }
}
