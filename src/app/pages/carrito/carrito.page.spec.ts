import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoPage } from './carrito.page';

describe('CarritoPage', () => {
  let component: CarritoPage;
  let fixture: ComponentFixture<CarritoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarritoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
