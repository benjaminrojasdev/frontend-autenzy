import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutenzyLoaderComponent } from './autenzy-loader.component';

describe('AutenzyLoaderComponent', () => {
  let component: AutenzyLoaderComponent;
  let fixture: ComponentFixture<AutenzyLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutenzyLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutenzyLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
