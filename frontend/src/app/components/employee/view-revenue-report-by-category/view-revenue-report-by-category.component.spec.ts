import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRevenueReportByCategoryComponent } from './view-revenue-report-by-category.component';

describe('ViewRevenueReportByCategoryComponent', () => {
  let component: ViewRevenueReportByCategoryComponent;
  let fixture: ComponentFixture<ViewRevenueReportByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRevenueReportByCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewRevenueReportByCategoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
