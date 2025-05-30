import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinOrCreateOrganizationComponent } from './join-or-create-organization.component';

describe('JoinOrCreateOrganizationComponent', () => {
  let component: JoinOrCreateOrganizationComponent;
  let fixture: ComponentFixture<JoinOrCreateOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinOrCreateOrganizationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinOrCreateOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
