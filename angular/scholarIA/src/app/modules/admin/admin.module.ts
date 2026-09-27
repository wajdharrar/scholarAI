import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminPaperComponent } from './components/admin-paper/admin-paper.component';
import { AdminEventsComponent } from './components/admin-events/admin-events.component';
import { EditPaperModalComponent } from './components/edit-paper-modal/edit-paper-modal.component';
import { AddPaperModalComponent } from './components/add-paper-modal/add-paper-modal.component';
import { AddEventModalComponent } from './components/add-event-modal/add-event-modal.component';
import { EditEventModalComponent } from './components/edit-event-modal/edit-event-modal.component';
import { EventDetailModalComponent } from './components/event-detail-modal/event-detail-modal.component';
import { AddUserModalComponent } from './components/add-user-modal/add-user-modal.component';
import { EditUserModalComponent } from './components/edit-user-modal/edit-user-modal.component';
import { UserDetailModalComponent } from './components/user-detail-modal/user-detail-modal.component';
import { AdminDomainComponent } from './components/admin-domain/admin-domain.component';
import { AddDomainModalComponent } from './components/add-domain-modal/add-domain-modal.component';
import { EditDomainModalComponent } from './components/edit-domain-modal/edit-domain-modal.component';
import { DomainDetailModalComponent } from './components/domain-detail-modal/domain-detail-modal.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminPaperComponent,
    AdminEventsComponent,
    EditPaperModalComponent,
    AddPaperModalComponent,
    AddEventModalComponent,
    EditEventModalComponent,
    EventDetailModalComponent,
    AddUserModalComponent,
    EditUserModalComponent,
    UserDetailModalComponent,
    AdminDomainComponent,
    AddDomainModalComponent,
    EditDomainModalComponent,
    DomainDetailModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
