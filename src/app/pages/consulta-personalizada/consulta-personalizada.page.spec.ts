import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaPersonalizadaPage } from './consulta-personalizada.page';

describe('ConsultaPersonalizadaPage', () => {
  let component: ConsultaPersonalizadaPage;
  let fixture: ComponentFixture<ConsultaPersonalizadaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaPersonalizadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
