import { Component } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent {
  isSidebarOpen = false;
  isVisible = false;
  faSearch = faSearch;
  searchTerm = '';
  onSearch() {
    // Perform your search logic here using this.searchTerm
    console.log('Searching for:', this.searchTerm);
  }
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    }, 50);
  }
}
