import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgsComponent } from './ecgs.component';

describe('EcgsComponent', () => {
  let component: EcgsComponent;
  let fixture: ComponentFixture<EcgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcgsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
