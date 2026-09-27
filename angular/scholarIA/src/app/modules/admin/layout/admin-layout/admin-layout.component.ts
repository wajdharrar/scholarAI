import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faChartLine, faUsers, faFileAlt, faComments, faStar, faCalendarAlt, faCog, faSignOutAlt, faBars, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import NavItem from 'app/interfaces/NavItem';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  faChartLine = faChartLine;
  faUsers = faUsers;
  faFileAlt = faFileAlt;
  faComments = faComments;
  faStar = faStar;
  faCalendarAlt = faCalendarAlt;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  faBars = faBars;
  faChevronRight = faChevronRight;

  sidebarOpen = true;

  navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: faChartLine, href: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: faUsers, href: '/admin/users' },
    { id: 'papers', label: 'Research Papers', icon: faFileAlt, href: '/admin/papers' },
    /*{ id: 'domains', label: 'Domains', icon: faStar, href: '/admin/domains' },*/
    { id: 'events', label: 'Events', icon: faCalendarAlt, href: '/admin/events' },
  ];

  constructor(public router: Router) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  handleSignOut(): void {
    // Add your sign-out logic here (clear tokens, etc.)
    console.log('Signing out...');
    // Example: this.authService.logout();
    // this.router.navigate(['/signin']);
  }
}
