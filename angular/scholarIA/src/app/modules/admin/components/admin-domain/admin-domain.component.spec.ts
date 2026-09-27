import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDomainComponent } from './admin-domain.component';

describe('AdminDomainComponent', () => {
  let component: AdminDomainComponent;
  let fixture: ComponentFixture<AdminDomainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDomainComponent]
    });
    fixture = TestBed.createComponent(AdminDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
