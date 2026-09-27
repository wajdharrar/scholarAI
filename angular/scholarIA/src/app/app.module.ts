import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { CommonModule } from '@angular/common';
import { IntrestsComponent } from './components/intrests/intrests.component';
import { PhotoComponent } from './components/photo/photo.component';
import { JwtInterceptor } from './services/jwt.interceptor';
import { PaperDetailsComponent } from './shared/paper-details/paper-details.component';
import { EventDetailsComponent } from './shared/event-details/event-details.component';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    IntrestsComponent,
    PhotoComponent,
    PaperDetailsComponent,
    EventDetailsComponent,
    EditProfileModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    FontAwesomeModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
