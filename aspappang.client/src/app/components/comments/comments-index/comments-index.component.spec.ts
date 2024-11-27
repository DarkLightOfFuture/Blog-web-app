import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsIndexComponent } from './comments-index.component';

describe('CommentsIndexComponent', () => {
  let component: CommentsIndexComponent;
  let fixture: ComponentFixture<CommentsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
