import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseTwoComponent } from './license-two.component';

describe('LicenseTwoComponent', () => {
  let component: LicenseTwoComponent;
  let fixture: ComponentFixture<LicenseTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenseTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
