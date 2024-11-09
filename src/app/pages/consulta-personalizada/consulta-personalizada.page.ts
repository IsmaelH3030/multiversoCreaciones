import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Subscription } from 'rxjs';  // Necesitamos importar Subscription

@Component({
  selector: 'app-consulta-personalizada',
  templateUrl: './consulta-personalizada.page.html',
  styleUrls: ['./consulta-personalizada.page.scss'],
})
export class ConsultaPersonalizadaPage implements OnInit {
  consultaForm: FormGroup;
  selectedImage: File = null;
  userEmail: string;
  userEmailSubscription: Subscription;  // Para gestionar la suscripción

  constructor(
    private fb: FormBuilder,
    private emailComposer: EmailComposer,
    private firebaseService: FirebaseService // Asegúrate de que este servicio esté bien configurado
  ) {}

  ngOnInit() {
    // Crea el formulario reactivo con validaciones
    this.consultaForm = this.fb.group({
      talla: ['', Validators.required],
      material: ['', Validators.required],
      sugerencia: ['', Validators.required],
    });

    // Suscríbete al Observable para obtener el correo del usuario
    this.userEmailSubscription = this.firebaseService.getUserEmail().subscribe(email => {
      this.userEmail = email;  // Asignar el correo del usuario cuando se reciba
    });
  }

  ngOnDestroy() {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.userEmailSubscription) {
      this.userEmailSubscription.unsubscribe();
    }
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
    // Verifica que el formulario sea válido y que haya una imagen adjunta
    if (this.consultaForm.valid && this.selectedImage) {
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
        attachments: []  // Inicializa 'attachments' como un array vacío
      };
      

      // Usar FileReader para convertir la imagen en base64
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
      // Si el formulario no es válido o falta la imagen, muestra un mensaje
      console.log('Por favor, completa todos los campos y adjunta una imagen.');
      alert('Por favor, completa todos los campos y adjunta una imagen.');
    }
  }
}
