import { Component, OnInit } from '@angular/core';
import {
  faSearch, faPlus, faDownload, faEllipsisVertical, faFilter,
  faChevronLeft, faChevronRight, faEnvelope, faCalendarAlt,
  faGlobe, faGraduationCap, faBuilding, faUserCheck,
  faUserXmark, faEye, faEdit, faTrash, faSort, faSortUp, faSortDown, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { UserResponse, UserService } from 'app/services/user.service';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  institution: string;
  country: string;
  status: 'active' | 'pending' | 'suspended';
  papers: number;
  citations: number;
  lastActive: string;
}

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  // Icons
  faSearch = faSearch;
  faPlus = faPlus;
  faDownload = faDownload;
  faEllipsisVertical = faEllipsisVertical;
  faFilter = faFilter;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faEnvelope = faEnvelope;
  faCalendarAlt = faCalendarAlt;
  faGlobe = faGlobe;
  faGraduationCap = faGraduationCap;
  faBuilding = faBuilding;
  faUserCheck = faUserCheck;
  faUserXmark = faUserXmark;
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faRefresh = faRefresh;

  // Data
  users: UserResponse[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortKey = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedUsers: string[] = [];
  showFilterMenu = false;
  selectedFilter = 'all';

  constructor(
    private userService: UserService // Placeholder for actual user service
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      console.log('Loaded users:', users);
    }, error => {
      console.error('Failed to load users, using mock data', error);
        });
  }

  // Filtering (only search)
  get filteredUsers(): UserResponse[] {
    if (!this.searchTerm.trim()) return this.users;
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(u =>
      u.firstName.toLowerCase().includes(term) ||
      u.lastName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.institution.toLowerCase().includes(term)
    );
  }

  // Sorting
  get sortedUsers(): UserResponse[] {
    const data = [...this.filteredUsers];
    data.sort((a, b) => {
      const aVal = a[this.sortKey as keyof UserResponse];
      const bVal = b[this.sortKey as keyof UserResponse];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return this.sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return data;
  }

  // Pagination
  get paginatedUsers(): UserResponse[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.sortedUsers.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.sortedUsers.length / this.itemsPerPage);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  // Sorting method
  setSort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(key: string): any {
    if (this.sortKey !== key) return faSort;
    return this.sortDirection === 'asc' ? faSortUp : faSortDown;
  }

  // Pagination actions
  goToPage(page: number): void {
    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  getPageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 5;
    const pages: number[] = [];
    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else if (current <= 3) {
      for (let i = 1; i <= maxVisible; i++) pages.push(i);
    } else if (current >= total - 2) {
      for (let i = total - maxVisible + 1; i <= total; i++) pages.push(i);
    } else {
      for (let i = current - 2; i <= current + 2; i++) pages.push(i);
    }
    return pages;
  }

  // Bulk selection
  toggleSelectAll(): void {
    if (this.selectedUsers.length === this.paginatedUsers.length) {
      this.selectedUsers = [];
    } else {
      this.selectedUsers = this.paginatedUsers.map(u => u.id);
    }
  }

  toggleSelectUser(id: string): void {
    if (this.selectedUsers.includes(id)) {
      this.selectedUsers = this.selectedUsers.filter(i => i !== id);
    } else {
      this.selectedUsers = [...this.selectedUsers, id];
    }
  }

  isAllSelected(): boolean {
    return this.paginatedUsers.length > 0 && this.selectedUsers.length === this.paginatedUsers.length;
  }


  deleteUser(id: string): void {
    alert(`Delete user ${id}`);
  }


  // Expose Math for template (optional, used in pagination)
  Math = Math;

  onItemsPerPageChange(value: number): void {
    this.itemsPerPage = value;
    this.currentPage = 1;
  }

  toggleFilterMenu(): void {
    this.showFilterMenu = !this.showFilterMenu;
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter;
    this.showFilterMenu = false;
    this.currentPage = 1;
  }

  getUserInitials(name: string): string {
    const parts = name.trim().split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  get totalPapers(): number {
    return this.users.reduce((sum, u) => sum + u.papersCount, 0);
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.sortedUsers.length);
  }
  showAddModal    = false;
  showEditModal   = false;
  showDetailModal = false;
  selectedUser: any = null;

  addUser(): void { this.showAddModal = true; }

  editUser(id: string): void {
    this.selectedUser = this.users.find(u => u.id === id);
    this.showEditModal = true;
  }

  viewUser(id: string): void {
    this.selectedUser = this.users.find(u => u.id === id);
    this.showDetailModal = true;
  }

  onUserCreated(): void { this.loadUsers(); }
  onUserUpdated(): void { this.loadUsers(); }

}