import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ViewRevenueReportComponent } from './view-revenue-report.component';

describe('ViewRevenueReportComponent', () => {
  let component: ViewRevenueReportComponent;
  let fixture: ComponentFixture<ViewRevenueReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRevenueReportComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewRevenueReportComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
