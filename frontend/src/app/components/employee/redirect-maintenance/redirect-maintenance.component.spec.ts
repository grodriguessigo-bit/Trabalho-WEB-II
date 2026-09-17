import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedirectMaintenanceComponent } from './redirect-maintenance.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RedirectMaintenanceComponent', () => {
  let component: RedirectMaintenanceComponent;
  let fixture: ComponentFixture<RedirectMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RedirectMaintenanceComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});