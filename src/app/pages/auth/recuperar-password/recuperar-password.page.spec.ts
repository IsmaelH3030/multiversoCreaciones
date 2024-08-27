import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarPasswordPage } from './recuperar-password.page';

describe('RecuperarPasswordPage', () => {
  let component: RecuperarPasswordPage;
  let fixture: ComponentFixture<RecuperarPasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
