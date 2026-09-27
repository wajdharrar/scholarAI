import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { UserRoutingModule } from './user-routing.module';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserCoursesComponent } from './components/user-courses/user-courses.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CreatePaperComponent } from './components/create-paper/create-paper.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { SafeUrlPipe } from '../../shared/safe-url.pipe';
import { ViewPaperComponent } from './components/view-paper/view-paper.component';
import { ViewEventComponent } from './components/view-event/view-event.component';
import { EditProfileModalComponent } from './components/edit-profile-modal/edit-profile-modal.component';
import { PaperAssistantComponent } from './components/paper-assistant/paper-assistant.component';

@NgModule({
  declarations: [
    UserLayoutComponent,
    UserDashboardComponent,
    UserCoursesComponent,
    UserProfileComponent,
    CreatePaperComponent,
    CreateEventComponent,
    SafeUrlPipe,
    ViewPaperComponent,
    ViewEventComponent,
    EditProfileModalComponent,
    PaperAssistantComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule,
    UserRoutingModule
  ]
})
export class UserModule { }
