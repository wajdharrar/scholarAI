# Angular Services Integration Guide

## Overview
This document outlines all the Angular services created to integrate with the Spring Boot backend controllers. The services are fully configured with JWT authentication support.

## Services Created

### 1. **Authentication Service** (`authentication.service.ts`)
Handles user authentication, JWT token management, and session persistence.

**Key Methods:**
- `login(request: AuthenticationRequest)` - Login with email and password
- `register(request: RegistrationRequest)` - Register new user
- `refreshToken()` - Refresh expired access token
- `getAccessToken()` - Retrieve stored JWT token
- `getRefreshToken()` - Retrieve refresh token
- `logout()` - Clear tokens and end session
- `isAuthenticated()` - Check authentication status

**Token Storage:**
- Access Token stored in `localStorage` under `access_token` key
- Refresh Token stored in `localStorage` under `refresh_token` key

---

### 2. **JWT Interceptor** (`jwt.interceptor.ts`)
Automatically injects JWT tokens into HTTP requests and handles token refresh on 401 errors.

**Features:**
- Automatically adds Bearer token to all HTTP requests
- Handles 401 Unauthorized errors with automatic token refresh
- Handles 403 Forbidden errors with logout and redirect
- Redirects to `/sign-in` on authentication failure

**Integration in app.module.ts:**
```typescript
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }
]
```

---

### 3. **Event Service** (`event.service.ts`)
Manages research events.

**API Base URL:** `http://localhost:8080/api/v1/event`

**Methods:**
- `addEvent(request)` - Create new event
- `updateEvent(eventId, request)` - Update event details
- `validateEvent(eventId)` - Validate event (admin)
- `rejectEvent(eventId)` - Reject event (admin)
- `getEventById(eventId)` - Get event details
- `getAllEvents()` - Get all events

---

### 4. **User Service** (`user.service.ts`)
Manages user profile and account settings.

**API Base URL:** `http://localhost:8080/api/v1/users`

**Methods:**
- `updateProfile(request)` - Update user profile information
- `getCurrentUser()` - Get current user details
- `changePassword(request)` - Change user password
- `deactivateAccount()` - Deactivate user account
- `reactivateAccount()` - Reactivate user account
- `deleteAccount()` - Delete user account permanently

---

### 5. **Domain Service** (`domain.service.ts`)
Manages research domains/categories.

**API Base URL:** `http://localhost:8080/api/v1/domains`

**Methods:**
- `addDomain(request)` - Create new domain
- `updateDomain(domainId, request)` - Update domain
- `getDomainById(domainId)` - Get domain details
- `getAllDomains()` - Get all domains

---

### 6. **Research Paper Service** (`research-paper.service.ts`)
Manages research papers and publications.

**API Base URL:** `http://localhost:8080/api/v1/papers`

**Methods:**
- `addResearchPaper(request)` - Submit new research paper
- `updateResearchPaper(paperId, request)` - Update paper details
- `validateResearchPaper(paperId)` - Validate paper (admin)
- `rejectResearchPaper(paperId)` - Reject paper (admin)
- `getResearchPaperById(paperId)` - Get paper details
- `getAllResearchPapers()` - Get all papers

---

### 7. **Collection Service** (`collection.service.ts`)
Manages user collections of papers.

**API Base URL:** `http://localhost:8080/api/v1/collection`

**Methods:**
- `addCollection(request)` - Create new collection
- `updateCollection(collectionId, request)` - Update collection
- `getAllCollectionsByUserId()` - Get user's collections (requires auth)
- `getCollectionById(collectionId)` - Get collection details

---

### 8. **Saved Paper Service** (`saved-paper.service.ts`)
Manages papers saved to collections.

**API Base URL:** `http://localhost:8080/api/v1/saved_paper`

**Methods:**
- `addPaperToCollection(request)` - Save paper to collection
- `removePaperFromCollection(request)` - Remove paper from collection

---

### 9. **Chat Session Service** (`chat-session.service.ts`)
Manages chat/discussion sessions for papers.

**API Base URL:** `http://localhost:8080/api/v1/chat_session`

**Methods:**
- `addChatSession(request)` - Create new chat session
- `getAllChatSessionsByUserId()` - Get user's chat sessions (requires auth)
- `getChatSessionById(chatSessionId)` - Get session details

---

### 10. **Chat Message Service** (`chat-message.service.ts`)
Manages messages within chat sessions.

**API Base URL:** `http://localhost:8080/api/v1/chat_message`

**Methods:**
- `addChatMessage(request)` - Add message to session
- `updateChatMessage(chatMessageId, request)` - Edit message
- `getAllChatMessagesBySessionId(sessionId)` - Get session messages
- `getChatMessageById(chatMessageId)` - Get message details

---

### 11. **Like Service** (`like.service.ts`)
Manages user likes on papers.

**API Base URL:** `http://localhost:8080/api/v1/like`

**Methods:**
- `addLike(request)` - Like a paper
- `getLikeById(likeId)` - Get like details
- `getAllLikesByUserId(userId)` - Get user's likes
- `getAllLikesByPaperId(paperId)` - Get likes on a paper

---

### 12. **Comment Service** (`comment.service.ts`)
Manages comments and discussions on papers.

**API Base URL:** `http://localhost:8080/api/v1/comment`

**Methods:**
- `addComment(request)` - Add comment to paper
- `replyToComment(request)` - Reply to existing comment
- `updateComment(commentId, request)` - Edit comment
- `signalComment(commentId)` - Report inappropriate comment
- `likeComment(commentId)` - Like a comment
- `getCommentById(commentId)` - Get comment details
- `getAllComments()` - Get all comments

---

## Usage Examples

### Authentication Flow

```typescript
import { Component } from '@angular/core';
import { AuthenticationService, AuthenticationRequest } from './services/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html'
})
export class SignInComponent {
  constructor(private authService: AuthenticationService) {}

  login() {
    const request: AuthenticationRequest = {
      email: 'user@example.com',
      password: 'password123'
    };

    this.authService.login(request).subscribe(
      response => {
        console.log('Login successful');
        // Redirect to home or dashboard
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }
}
```

### Using Protected Services

```typescript
import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { ResearchPaperService } from './services/research-paper.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  constructor(
    private userService: UserService,
    private paperService: ResearchPaperService
  ) {}

  ngOnInit() {
    // Get current user (JWT token automatically added by interceptor)
    this.userService.getCurrentUser().subscribe(
      user => console.log('Current user:', user),
      error => console.error('Error fetching user:', error)
    );

    // Get all research papers
    this.paperService.getAllResearchPapers().subscribe(
      papers => console.log('Papers:', papers),
      error => console.error('Error fetching papers:', error)
    );
  }
}
```

### Adding a Paper to Collection

```typescript
import { Component } from '@angular/core';
import { SavedPaperService, AddPaperToCollectionRequest } from './services/saved-paper.service';

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html'
})
export class PaperDetailComponent {
  constructor(private savedPaperService: SavedPaperService) {}

  savePaperToCollection(paperId: string, collectionId: string) {
    const request: AddPaperToCollectionRequest = {
      paperId,
      collectionId
    };

    this.savedPaperService.addPaperToCollection(request).subscribe(
      () => console.log('Paper saved to collection'),
      error => console.error('Error saving paper:', error)
    );
  }
}
```

---

## JWT Token Handling

### How It Works

1. **Login:** User logs in → Backend returns `accessToken` and `refreshToken`
2. **Storage:** Both tokens are stored in `localStorage`
3. **Request:** JwtInterceptor automatically adds `Authorization: Bearer <token>` header
4. **Expiration:** If token expires (401 response):
   - Interceptor automatically calls `/api/v1/auth/refresh` with `refreshToken`
   - New `accessToken` is obtained and stored
   - Original request is retried with new token
5. **Logout:** User logs out → Tokens are cleared from `localStorage`

### Token Refresh Flow

```
Request → Token Valid? → Yes → Continue Request
                ↓
              No
                ↓
         Get Refresh Token
                ↓
         POST /api/v1/auth/refresh
                ↓
         Store New Access Token
                ↓
         Retry Original Request
```

---

## Important Notes

### API Base URLs
- All services currently point to `http://localhost:8080`
- Change this to your production URL in each service
- Consider using an environment configuration file for different environments

### Authentication Guard
Consider creating an Angular Route Guard to protect authenticated routes:

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/sign-in']);
    return false;
  }
}
```

### Error Handling
All services support RxJS operators for error handling:

```typescript
this.userService.getCurrentUser().subscribe(
  user => { /* handle success */ },
  error => {
    if (error.status === 401) {
      // Handle unauthorized
    } else if (error.status === 403) {
      // Handle forbidden
    } else {
      // Handle other errors
    }
  }
);
```

---

## Service Dependency Injection

All services are provided in the root injector using `providedIn: 'root'`. They can be injected into any component:

```typescript
constructor(
  private eventService: EventService,
  private userService: UserService,
  private paperService: ResearchPaperService
) {}
```

---

## Next Steps

1. **Update API URLs:** Change `http://localhost:8080` to your production backend URL
2. **Implement Components:** Use these services in your Angular components
3. **Add Route Guards:** Protect authenticated routes using AuthGuard
4. **Error Handling:** Implement proper error handling and user notifications
5. **Testing:** Add unit tests for services using Angular testing utilities
6. **Environment Configuration:** Use Angular environment files for different API endpoints

---

## Controller to Service Mapping

| Backend Controller | Angular Service | Base URL |
|---|---|---|
| EventController | EventService | `/api/v1/event` |
| UserController | UserService | `/api/v1/users` |
| AuthenticationController | AuthenticationService | `/api/v1/auth` |
| DomainController | DomainService | `/api/v1/domains` |
| ResearchPaperController | ResearchPaperService | `/api/v1/papers` |
| CollectionController | CollectionService | `/api/v1/collection` |
| SavedPaperController | SavedPaperService | `/api/v1/saved_paper` |
| ChatSessionController | ChatSessionService | `/api/v1/chat_session` |
| ChatMessageController | ChatMessageService | `/api/v1/chat_message` |
| LikeController | LikeService | `/api/v1/like` |
| CommentController | CommentService | `/api/v1/comment` |

---

## Support
For issues or questions, refer to the individual service documentation or the backend controller implementations.
