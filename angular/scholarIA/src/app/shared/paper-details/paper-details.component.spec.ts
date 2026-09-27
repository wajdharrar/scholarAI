import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperDetailsComponent } from './paper-details.component';

describe('PaperDetailsComponent', () => {
  let component: PaperDetailsComponent;
  let fixture: ComponentFixture<PaperDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaperDetailsComponent]
    });
    fixture = TestBed.createComponent(PaperDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
