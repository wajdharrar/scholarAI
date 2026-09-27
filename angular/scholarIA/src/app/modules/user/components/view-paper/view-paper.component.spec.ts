import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaperComponent } from './view-paper.component';

describe('ViewPaperComponent', () => {
  let component: ViewPaperComponent;
  let fixture: ComponentFixture<ViewPaperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPaperComponent]
    });
    fixture = TestBed.createComponent(ViewPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
