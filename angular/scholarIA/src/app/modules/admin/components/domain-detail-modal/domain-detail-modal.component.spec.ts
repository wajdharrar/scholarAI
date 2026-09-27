import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainDetailModalComponent } from './domain-detail-modal.component';

describe('DomainDetailModalComponent', () => {
  let component: DomainDetailModalComponent;
  let fixture: ComponentFixture<DomainDetailModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DomainDetailModalComponent]
    });
    fixture = TestBed.createComponent(DomainDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
