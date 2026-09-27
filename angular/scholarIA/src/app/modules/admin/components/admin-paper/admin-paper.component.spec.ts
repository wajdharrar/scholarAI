import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaperComponent } from './admin-paper.component';

describe('AdminPaperComponent', () => {
  let component: AdminPaperComponent;
  let fixture: ComponentFixture<AdminPaperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPaperComponent]
    });
    fixture = TestBed.createComponent(AdminPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
