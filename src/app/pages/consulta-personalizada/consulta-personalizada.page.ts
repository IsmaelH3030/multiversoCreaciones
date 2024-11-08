import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx'; // Asegúrate de tener el plugin de email configurado en tu proyecto
import { FirebaseService } from 'src/app/services/firebase.service'; // Servicio que te devuelve los datos del usuario (si lo tienes configurado)

@Component({
  selector: 'app-consulta-personalizada',
  templateUrl: './consulta-personalizada.page.html',
  styleUrls: ['./consulta-personalizada.page.scss'],
})
export class ConsultaPersonalizadaPage implements OnInit {
  consultaForm: FormGroup;
  selectedImage: File = null;
  userEmail: string;

  constructor(
    private fb: FormBuilder,
    private emailComposer: EmailComposer,
    private firebaseService: FirebaseService // Asegúrate de tener un servicio de usuario
  ) {}

  ngOnInit() {
    // Crea el formulario reactivo
    this.consultaForm = this.fb.group({
      talla: ['', Validators.required],
      material: ['', Validators.required],
      sugerencia: ['', Validators.required],
    });

    // Obtén el correo del usuario (si lo tienes en un servicio)
    this.userEmail = this.firebaseService.getUserEmail(); // Asegúrate de tener este método en tu servicio
  }

  // Manejo de la imagen seleccionada
  onImageSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  // Enviar el formulario por correo
  onSubmit() {
    if (this.consultaForm.valid) {
      const { talla, material, sugerencia } = this.consultaForm.value;

      // Crear el cuerpo del mensaje con los datos del formulario
      const emailBody = `
        <p><strong>Talla:</strong> ${talla}</p>
        <p><strong>Material:</strong> ${material}</p>
        <p><strong>Sugerencia:</strong> ${sugerencia}</p>
        <p><strong>Email del Usuario:</strong> ${this.userEmail}</p>
      `;

      // Configuración del correo
      const email: any = {
        to: 'multiverso_creaciones2@hotmail.com',
        subject: 'Consulta Personalizada de Polera',
        body: emailBody,
        isHtml: true,
        attachments: []  // Asegúrate de inicializar 'attachments' como un array vacío
      };

      // Si hay una imagen seleccionada, adjuntarla al correo
      if (this.selectedImage) {
        // Usar FileReader para convertir la imagen en base64 o subirla a tu servidor y obtener el enlace
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64Image = e.target.result;
          email.attachments = [
            {
              fileName: this.selectedImage.name,
              base64: base64Image,
            },
          ];

          // Enviar el correo
          this.emailComposer.open(email);
        };
        reader.readAsDataURL(this.selectedImage);
      } else {
        // Enviar el correo sin imagen
        this.emailComposer.open(email);
      }
    }
  }
}
