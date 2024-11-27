import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsIndexComponent } from './posts-index.component';

describe('PostsIndexComponent', () => {
  let component: PostsIndexComponent;
  let fixture: ComponentFixture<PostsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
