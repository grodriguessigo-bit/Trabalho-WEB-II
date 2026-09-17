import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PerformMaintenanceComponent } from './perform-maintenance.component';

describe('PerformMaintenanceComponent', () => {
  let component: PerformMaintenanceComponent;
  let fixture: ComponentFixture<PerformMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformMaintenanceComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PerformMaintenanceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});