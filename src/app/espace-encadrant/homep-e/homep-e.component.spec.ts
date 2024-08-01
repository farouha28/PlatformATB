import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepEComponent } from './homep-e.component';

describe('HomepEComponent', () => {
  let component: HomepEComponent;
  let fixture: ComponentFixture<HomepEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepEComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
