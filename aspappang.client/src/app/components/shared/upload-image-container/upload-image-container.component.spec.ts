import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImageContainerComponent } from './upload-image-container.component';

describe('UploadImageContainerComponent', () => {
  let component: UploadImageContainerComponent;
  let fixture: ComponentFixture<UploadImageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadImageContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadImageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
