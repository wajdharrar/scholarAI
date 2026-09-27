import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperAssistantComponent } from './paper-assistant.component';

describe('PaperAssistantComponent', () => {
  let component: PaperAssistantComponent;
  let fixture: ComponentFixture<PaperAssistantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaperAssistantComponent]
    });
    fixture = TestBed.createComponent(PaperAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
