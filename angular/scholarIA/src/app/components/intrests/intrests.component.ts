import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRight, faArrowLeft, faCheck, faRobot, faBrain, faDna, faGlobe, faMicroscope, faChartLine, faAtom, faLeaf } from '@fortawesome/free-solid-svg-icons';
import Interest from 'app/interfaces/Interest';
import { AuthenticationService } from '../../services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-intrests',
  templateUrl: './intrests.component.html',
  styleUrls: ['./intrests.component.css']
})
export class IntrestsComponent {
faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCheck = faCheck;
  faRobot = faRobot;
  faBrain = faBrain;
  faDna = faDna;
  faGlobe = faGlobe;
  faMicroscope = faMicroscope;
  faChartLine = faChartLine;
  faAtom = faAtom;
  faLeaf = faLeaf;

  interests: Interest[] = [
    { id: 'ai', name: 'Artificial Intelligence', icon: faRobot, color: 'from-purple-500 to-pink-500' },
    { id: 'neuroscience', name: 'Neuroscience', icon: faBrain, color: 'from-blue-500 to-cyan-500' },
    { id: 'biology', name: 'Molecular Biology', icon: faDna, color: 'from-green-500 to-emerald-500' },
    { id: 'climate', name: 'Climate Science', icon: faGlobe, color: 'from-teal-500 to-green-500' },
    { id: 'medicine', name: 'Medical Research', icon: faMicroscope, color: 'from-red-500 to-orange-500' },
    { id: 'economics', name: 'Economics', icon: faChartLine, color: 'from-yellow-500 to-amber-500' },
    { id: 'physics', name: 'Physics', icon: faAtom, color: 'from-indigo-500 to-purple-500' },
    { id: 'environmental', name: 'Environmental Science', icon: faLeaf, color: 'from-lime-500 to-green-500' }
  ];

  selectedInterests: string[] = [];
  isLoading = false;
  isInitialLoading = true;
  hasValidData = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    const signupData = localStorage.getItem('signup_data');
    if (!signupData) {
      Swal.fire({
        icon: 'error',
        title: 'Missing data',
        text: 'Please complete Step 1 first',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/sign-up']);
      });
    } else {
      this.hasValidData = true;
    }
    this.isInitialLoading = false;
  }

  toggleInterest(id: string): void {
    if (this.isLoading) return;

    const interestName = this.interests.find(i => i.id === id)?.name || '';
    if (this.selectedInterests.includes(interestName)) {
      this.selectedInterests = this.selectedInterests.filter(i => i !== interestName);
    } else if (this.selectedInterests.length < 5) {
      this.selectedInterests = [...this.selectedInterests, interestName];
    }
  }

  async handleComplete(): Promise<void> {
    if (this.selectedInterests.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'No interests selected',
        text: 'Please select at least one interest',
        confirmButtonText: 'Got it'
      });
      return;
    }

    this.isLoading = true;

    try {
      const signupDataStr = localStorage.getItem('signup_data');
      const profilePhoto = localStorage.getItem('profile_photo');

      if (!signupDataStr) {
        await Swal.fire({
          icon: 'error',
          title: 'Signup data missing',
          text: 'Please start over',
          confirmButtonText: 'OK'
        });
        this.router.navigate(['/sign-up']);
        return;
      }

      const signupData = JSON.parse(signupDataStr);
      const registrationData = {
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
        institution: signupData.institution,
        country: signupData.country,
        imageUrl: profilePhoto || '',
        domain: this.selectedInterests
      };

      console.log('Submitting registration with interests:', registrationData);

      // Replace with your actual API endpoint
      const response = await this.authService.register(registrationData).toPromise();

      console.log('Registration successful:', response);

      localStorage.removeItem('signup_data');
      localStorage.removeItem('profile_photo');

      await Swal.fire({
        icon: 'success',
        title: 'Account created!',
        text: 'Redirecting to login...',
        timer: 1500,
        showConfirmButton: false
      });

      this.router.navigate(['/sign-in']);
    } catch (error: any) {
      console.error('Registration failed:', error);
      const message = error.error?.message || 'Registration failed. Please try again.';
      await Swal.fire({
        icon: 'error',
        title: 'Registration failed',
        text: message,
        confirmButtonText: 'Try again'
      });
    } finally {
      this.isLoading = false;
    }
  }

  handleSkip(): void {
    Swal.fire({
      icon: 'info',
      title: 'Interests required',
      text: 'Please select at least one interest to continue',
      confirmButtonText: 'OK'
    });
  }

  goBack(): void {
    this.router.navigate(['/photo']); // adjust route as needed
  }
}
