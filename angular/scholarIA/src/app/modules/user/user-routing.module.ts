import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserCoursesComponent } from './components/user-courses/user-courses.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CreatePaperComponent } from './components/create-paper/create-paper.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ViewPaperComponent } from './components/view-paper/view-paper.component';
import { ViewEventComponent } from './components/view-event/view-event.component';
import { PaperAssistantComponent } from './components/paper-assistant/paper-assistant.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'courses', component: UserCoursesComponent },
      { path: 'profile', component: UserProfileComponent },
      { path : 'papers/publish', component: CreatePaperComponent},
      { path : 'events/create', component: CreateEventComponent},
      { path: 'papers', component:ViewPaperComponent},
      { path: 'events', component: ViewEventComponent},
      { path: 'ia', component: PaperAssistantComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
