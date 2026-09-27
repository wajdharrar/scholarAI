import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaperModalComponent } from './edit-paper-modal.component';

describe('EditPaperModalComponent', () => {
  let component: EditPaperModalComponent;
  let fixture: ComponentFixture<EditPaperModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPaperModalComponent]
    });
    fixture = TestBed.createComponent(EditPaperModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
