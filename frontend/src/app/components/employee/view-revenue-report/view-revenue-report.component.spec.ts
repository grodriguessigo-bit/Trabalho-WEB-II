import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRevenueReportComponent } from './view-revenue-report.component';

describe('ViewRevenueReportComponent', () => {
  let component: ViewRevenueReportComponent;
  let fixture: ComponentFixture<ViewRevenueReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRevenueReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewRevenueReportComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
