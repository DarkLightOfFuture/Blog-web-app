import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsIndexComponent } from './tags-index.component';

describe('TagsIndexComponent', () => {
  let component: TagsIndexComponent;
  let fixture: ComponentFixture<TagsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
