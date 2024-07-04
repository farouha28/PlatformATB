import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceChefComponent } from './espace-chef.component';

describe('EspaceChefComponent', () => {
  let component: EspaceChefComponent;
  let fixture: ComponentFixture<EspaceChefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspaceChefComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspaceChefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
