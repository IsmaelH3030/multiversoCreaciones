import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Para subir la imagen
import { AngularFireFunctions } from '@angular/fire/compat/functions'; // Para llamar a la función de Firebase
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage {
  contactMessage = {
    name: '',
    email: '',
    message: '',
    imageUrl: ''
  };

  uploadPercent: number | null = null;
  imageUrl: string | null = null;

  constructor(private storage: AngularFireStorage, private functions: AngularFireFunctions) {}

  // Método para subir la imagen
  uploadImage(event: any) {
    const file = event.target.files[0];
    const filePath = `contact-images/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.percentageChanges().subscribe(percent => {
      this.uploadPercent = percent;
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.imageUrl = url;
          this.contactMessage.imageUrl = url;
        });
      })
    ).subscribe();
  }

  // Método para enviar el mensaje de contacto
  sendContactMessage() {
    if (this.contactMessage.name && this.contactMessage.email && this.contactMessage.message) {
      const contactData = {
        name: this.contactMessage.name,
        email: this.contactMessage.email,
        message: this.contactMessage.message,
        imageUrl: this.contactMessage.imageUrl
      };

      // Llamar a la función de Firebase para enviar el correo
      const sendEmail = this.functions.httpsCallable('sendContactEmail');
      sendEmail(contactData).subscribe(response => {
        console.log('Correo enviado exitosamente:', response);
        // Aquí puedes manejar la respuesta o mostrar un mensaje de éxito al usuario
      }, error => {
        console.error('Error al enviar correo:', error);
        // Aquí puedes manejar el error
      });
    } else {
      console.error('Todos los campos son obligatorios.');
      // Mostrar un mensaje de error si no se han llenado los campos
    }
  }
}
