import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDomainModalComponent } from './add-domain-modal.component';

describe('AddDomainModalComponent', () => {
  let component: AddDomainModalComponent;
  let fixture: ComponentFixture<AddDomainModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDomainModalComponent]
    });
    fixture = TestBed.createComponent(AddDomainModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
