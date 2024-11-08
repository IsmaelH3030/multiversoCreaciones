import { Component, OnInit } from '@angular/core'; // Importa el decorador Component y la interfaz OnInit de Angular

@Component({
  selector: 'app-tabs', // Selector utilizado en la plantilla HTML para insertar este componente
  templateUrl: './tabs.page.html', // Ruta al archivo HTML que define la plantilla del componente
  styleUrls: ['./tabs.page.scss'], // Ruta al archivo SCSS que define los estilos del componente
})
export class TabsPage implements OnInit { // Declara la clase TabsPage que implementa la interfaz OnInit

  // Definición de la propiedad contactMessage
  contactMessage = {
    name: '',
    email: '',
    message: ''
  };

  constructor() { } // Constructor del componente, se utiliza para inyectar servicios si es necesario

  ngOnInit() { // Método del ciclo de vida que se ejecuta al inicializar el componente
    // Se pueden inicializar datos o ejecutar lógica adicional aquí
  }
  
  // Método para manejar el envío del formulario
  sendContactMessage() {
    console.log('Formulario enviado:', this.contactMessage);
  }

  // Método para manejar la carga de imagen
  uploadImage(event: any) {
    console.log(event.target.files[0]); // Aquí puedes manejar la carga de la imagen
  }
}
