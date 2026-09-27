import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { faSearch, faPlus, faEdit, faTrash, faEye, faRefresh, faGlobe } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { DomainResponse, DomainService } from 'app/services/domain.service';


@Component({
  selector: 'app-admin-domain',
  templateUrl: './admin-domain.component.html',
  styleUrls: ['./admin-domain.component.css']
})
export class AdminDomainComponent implements OnInit {

  faSearch  = faSearch;
  faPlus    = faPlus;
  faEdit    = faEdit;
  faTrash   = faTrash;
  faEye     = faEye;
  faRefresh = faRefresh;
  faGlobe   = faGlobe;

  domains: DomainResponse[] = [];
  searchTerm = '';
  isLoading  = false;

  showAddModal    = false;
  showEditModal   = false;
  showDetailModal = false;
  selectedDomain: DomainResponse | null = null;

  constructor(private domainService: DomainService) {}

  ngOnInit(): void { this.loadDomains(); }

  loadDomains(): void {
    this.isLoading = true;
    this.domainService.getAllDomains().subscribe({
      next: (data) => { this.domains = data; this.isLoading = false; },
      error: ()     => { this.isLoading = false; }
    });
  }

  get filteredDomains(): DomainResponse[] {
    const term = this.searchTerm.toLowerCase();
    return this.domains.filter(d => d.name.toLowerCase().includes(term));
  }

  viewDomain(id: string): void {
    this.selectedDomain = this.domains.find(d => d.id === id) || null;
    this.showDetailModal = true;
  }

  editDomain(id: string): void {
    this.selectedDomain = this.domains.find(d => d.id === id) || null;
    this.showEditModal = true;
  }

  deleteDomain(id: string): void {
    const domain = this.domains.find(d => d.id === id);
    Swal.fire({
      title: `Delete "${domain?.name}"?`,
      text: 'This will remove the domain and unlink all associated papers.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#ef4444'
    }).then(result => {
      if (result.isConfirmed) {
        this.domainService.deleteDomain(id).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
            this.loadDomains();
          },
          error: (err) => Swal.fire('Error', err.error?.message || 'Failed to delete.', 'error')
        });
      }
    });
  }

  onDomainCreated(): void { this.loadDomains(); }
  onDomainUpdated(): void { this.loadDomains(); }
}