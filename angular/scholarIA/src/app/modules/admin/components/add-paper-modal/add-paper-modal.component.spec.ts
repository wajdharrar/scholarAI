import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaperModalComponent } from './add-paper-modal.component';

describe('AddPaperModalComponent', () => {
  let component: AddPaperModalComponent;
  let fixture: ComponentFixture<AddPaperModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPaperModalComponent]
    });
    fixture = TestBed.createComponent(AddPaperModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
