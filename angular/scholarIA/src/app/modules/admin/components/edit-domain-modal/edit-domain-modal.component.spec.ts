import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDomainModalComponent } from './edit-domain-modal.component';

describe('EditDomainModalComponent', () => {
  let component: EditDomainModalComponent;
  let fixture: ComponentFixture<EditDomainModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDomainModalComponent]
    });
    fixture = TestBed.createComponent(EditDomainModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
