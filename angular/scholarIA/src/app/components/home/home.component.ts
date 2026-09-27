import { Component, AfterViewInit, OnDestroy, ViewChildren, ElementRef, QueryList, OnInit } from '@angular/core';
import { faUpload, faArrowTrendUp, faBook, faStar, faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { EventService } from 'app/services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  // Expose icons to template
  faUpload = faUpload;
  faArrowTrendUp = faArrowTrendUp;
  faBook = faBook;
  faStar = faStar;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faLocationDot = faLocationDot;

  // Animation state for navbar & hero
  isVisible = false;

  // Hero Slider Variables
  currentSlide = 0;
  private slideInterval: any;

  // Form data
  formData = {
    name: '',
    email: '',
    message: ''
  };

  // Feature visibility flags (scroll animations)
  feature1Visible = false;
  feature2Visible = false;
  feature3Visible = false;

  // Reference the parent section wrappers directly
  @ViewChildren('feature1, feature2, feature3')
  featureElements!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;
  eventData: any[] = [];

  testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Neuroscience Researcher, Stanford University',
      content: 'Scholar IA has revolutionized how I keep up with literature. The personalized feed saves me hours every week, and the AI summaries help me quickly identify papers worth diving into.',
      rating: 5
    },
    {
      name: 'Prof. Michael Okonkwo',
      role: 'Professor of Computer Science, University of Lagos',
      content: 'The conversational search feature is a game-changer. I can now find exactly what I need without endless keyword combinations. My students love it too!',
      rating: 5
    },
    {
      name: 'Dr. Elena Rodriguez',
      role: 'Postdoctoral Fellow, Max Planck Institute',
      content: 'The audio summaries let me stay updated during my commute. It\'s like having a research assistant in my pocket. Highly recommended for busy academics.',
      rating: 5
    }
  ];

  constructor(private eventService: EventService) {}

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    }, 50);
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe(events => {
      console.log('Events fetched successfully:', events);
      this.eventData = events.filter(event => event.status === 'UPCOMING');
      this.eventData.forEach(event => {
        console.log('Approved event:', event);
        event.imageUrl = this.getFileUrl(event.imageUrl || '');
      });
      
      // Initialize automatic slider if more than one event exists
      this.startSlider();
    });
  }

  getFileUrl(fullPath: string): string {
    if (!fullPath) return '';
    const filename = fullPath.split('\\').pop()?.split('/').pop() || '';
    return `http://localhost:8080/api/v1/files/${filename}`;
  }

  // --- Hero Slider Logic ---
  startSlider() {
    this.stopSlider();
    if (this.eventData.length > 1) {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, 5000); // Change slides every 5 seconds
    }
  }

  stopSlider() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide() {
    if (this.eventData.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % this.eventData.length;
  }

  prevSlide() {
    if (this.eventData.length === 0) return;
    this.currentSlide = (this.currentSlide - 1 + this.eventData.length) % this.eventData.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.startSlider(); // Reset timer on manual navigation
  }

  // --- Scroll Observer Logic ---
  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target as HTMLElement;
          const elementsArray = this.featureElements.toArray();

          if (target === elementsArray[0]?.nativeElement) {
            this.feature1Visible = true;
            this.observer.unobserve(target); // Unobserve once animated
          } else if (target === elementsArray[1]?.nativeElement) {
            this.feature2Visible = true;
            this.observer.unobserve(target);
          } else if (target === elementsArray[2]?.nativeElement) {
            this.feature3Visible = true;
            this.observer.unobserve(target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    // Dynamic checks handle async initialization cleanly
    this.featureElements.changes.subscribe(() => {
      this.observeElements();
    });

    this.observeElements();
  }

  private observeElements() {
    this.featureElements?.forEach((elem) => {
      if (elem?.nativeElement) {
        this.observer.observe(elem.nativeElement);
      }
    });
  }

  ngOnDestroy() {
    this.stopSlider();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.formData = {
      ...this.formData,
      [target.name]: target.value
    };
  }

  onSubmit() {
    alert('Thank you for your message! We\'ll get back to you soon.');
    this.formData = { name: '', email: '', message: '' };
  }
}