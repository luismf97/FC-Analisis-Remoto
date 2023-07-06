import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmsComponent } from './bpms.component';

describe('BpmsComponent', () => {
  let component: BpmsComponent;
  let fixture: ComponentFixture<BpmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
