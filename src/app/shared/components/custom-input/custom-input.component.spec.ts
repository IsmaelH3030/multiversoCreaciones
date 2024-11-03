import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'; // Importa las utilidades de prueba de Angular
import { IonicModule } from '@ionic/angular'; // Importa el módulo Ionic necesario para las pruebas

import { CustomInputComponent } from './custom-input.component'; // Importa el componente que se va a probar

describe('CustomInputComponent', () => { // Describe un bloque de pruebas para el componente CustomInputComponent
  let component: CustomInputComponent; // Declara una variable para el componente
  let fixture: ComponentFixture<CustomInputComponent>; // Declara una variable para el fixture del componente

  beforeEach(waitForAsync(() => { // Antes de cada prueba, configura el entorno de pruebas de manera asíncrona
    TestBed.configureTestingModule({ // Configura un módulo de prueba
      declarations: [ CustomInputComponent ], // Declara el componente que se va a probar
      imports: [IonicModule.forRoot()] // Importa el módulo raíz de Ionic para proporcionar contexto a las pruebas
    }).compileComponents(); // Compila los componentes declarados

    fixture = TestBed.createComponent(CustomInputComponent); // Crea una instancia del componente
    component = fixture.componentInstance; // Obtiene la instancia del componente del fixture
    fixture.detectChanges(); // Detecta cambios en el componente para inicializarlo
  }));

  it('should create', () => { // Define una prueba
    expect(component).toBeTruthy(); // Verifica que la instancia del componente se haya creado correctamente
  });
});
