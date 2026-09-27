import { Component } from '@angular/core';
import { faSearch, faBell, faArrowUp, faArrowDown, faGlobe, faMicrochip, faBrain, faDna, faUsers, faFileAlt, faDownload, faUserGraduate, IconDefinition } from '@fortawesome/free-solid-svg-icons';
export interface Stat {
  label: string;
  value: string;
  icon: IconDefinition;
  change: string;
  trend: 'up' | 'down';
  color: string;
}
 
export interface Activity {
  user: string;
  action: string;
  paper: string;
  time: string;
  avatar: string;
}
 
export interface TopPaper {
  title: string;
  views: string;
  downloads: string;
  citations: number;
  trend: string;
}
 
export interface Category {
  name: string;
  count: number;
  icon: IconDefinition;
  color: string;
}
 
export interface BarItem {
  height: number;
}
 
export interface LinePoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
    // Icons
  faSearch = faSearch;
  faBell = faBell;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faGlobe = faGlobe;
  faMicrochip = faMicrochip;
  faBrain = faBrain;
  faDna = faDna;
 
  today: string = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
 
  stats: Stat[] = [
    { label: 'Total Users', value: '24,521', icon: faUsers, change: '+12%', trend: 'up', color: 'from-blue-500 to-blue-600' },
    { label: 'Research Papers', value: '12,849', icon: faFileAlt, change: '+23%', trend: 'up', color: 'from-cyan-500 to-cyan-600' },
    { label: 'Downloads', value: '89.2K', icon: faDownload, change: '+45%', trend: 'up', color: 'from-blue-400 to-cyan-500' },
    { label: 'Active Users', value: '3,421', icon: faUserGraduate, change: '-2%', trend: 'down', color: 'from-blue-600 to-blue-700' },
  ];
 
  recentActivity: Activity[] = [
    { user: 'Dr. Sarah Chen', action: 'uploaded', paper: 'Neural Networks in Healthcare', time: '2 min ago', avatar: 'SC' },
    { user: 'Prof. Michael Okonkwo', action: 'downloaded', paper: 'Climate Change Models', time: '15 min ago', avatar: 'MO' },
    { user: 'Dr. Elena Rodriguez', action: 'commented on', paper: 'CRISPR Gene Editing', time: '1 hour ago', avatar: 'ER' },
    { user: 'Prof. James Wilson', action: 'shared', paper: 'Quantum Computing Advances', time: '3 hours ago', avatar: 'JW' },
    { user: 'Dr. Maria Garcia', action: 'cited', paper: 'Cancer Research Breakthroughs', time: '5 hours ago', avatar: 'MG' },
  ];
 
  topPapers: TopPaper[] = [
    { title: 'Advances in Neural Networks', views: '12.4K', downloads: '8.2K', citations: 342, trend: '+23%' },
    { title: 'Climate Change 2025 Analysis', views: '8.7K', downloads: '5.1K', citations: 156, trend: '+15%' },
    { title: 'CRISPR Gene Therapy', views: '15.2K', downloads: '11.3K', citations: 489, trend: '+34%' },
    { title: 'Quantum Machine Learning', views: '6.8K', downloads: '4.2K', citations: 98, trend: '+8%' },
  ];
 
  categories: Category[] = [
    { name: 'Artificial Intelligence', count: 3241, icon: faMicrochip, color: 'from-purple-500 to-pink-500' },
    { name: 'Neuroscience', count: 2156, icon: faBrain, color: 'from-blue-500 to-cyan-500' },
    { name: 'Molecular Biology', count: 1892, icon: faDna, color: 'from-green-500 to-emerald-500' },
    { name: 'Climate Science', count: 1543, icon: faGlobe, color: 'from-teal-500 to-green-500' },
  ];
 
  barHeights: number[] = [35, 50, 45, 70, 55, 65, 80, 75, 60, 85];
 
  weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  activityCounts: number[] = [4, 3, 5, 2, 4, 1, 3];
  activityRows: number[] = [0, 1, 2, 3, 4];
 
  // SVG line graph path
  linePath = 'M0,80 L40,60 L80,45 L120,30 L160,25 L200,35 L240,20 L280,25 L300,15';
  areaPath = 'M0,80 L40,60 L80,45 L120,30 L160,25 L200,35 L240,20 L280,25 L300,15 L300,100 L0,100 Z';
 
  linePoints: LinePoint[] = [
    { x: 0, y: 80 }, { x: 40, y: 60 }, { x: 80, y: 45 },
    { x: 120, y: 30 }, { x: 160, y: 25 }, { x: 200, y: 35 },
    { x: 240, y: 20 }, { x: 280, y: 25 }, { x: 300, y: 15 }
  ];
 
  isActivityFilled(dayIndex: number, rowIndex: number): boolean {
    return rowIndex < this.activityCounts[dayIndex];
  }
 
  getBarStyle(height: number): { [key: string]: string } {
    return { height: `${height}px` };
  }
}
