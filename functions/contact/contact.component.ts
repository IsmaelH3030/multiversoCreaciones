// contact.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Para subir la imagen
import { AngularFireFunctions } from '@angular/fire/compat/functions'; // Para llamar a la función de Firebase
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',  // Vinculación con el HTML
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactMessage = {
    name: '',
    email: '',
    message: '',
    imageUrl: ''
  };
  uploadPercent: number | null = null;
  imageUrl: string | null = null;

  @Output() formSubmitted = new EventEmitter<void>();

  constructor(private storage: AngularFireStorage, private functions: AngularFireFunctions) {}

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }
    const filePath = `contact-images/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.percentageChanges().subscribe((percent: number | undefined) => {
      this.uploadPercent = percent ?? null;
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

  sendContactMessage() {
    if (this.contactMessage.name && this.contactMessage.email && this.contactMessage.message) {
      const contactData = {
        name: this.contactMessage.name,
        email: this.contactMessage.email,
        message: this.contactMessage.message,
        imageUrl: this.contactMessage.imageUrl
      };

      const sendEmail = this.functions.httpsCallable('sendContactForm');
      sendEmail(contactData).subscribe({
        next: (response) => {
          console.log('Correo enviado:', response);
          this.formSubmitted.emit(); // Emitir el evento cuando se envía el formulario
        },
        error: (err) => {
          console.error('Error al enviar el correo:', err);
        }
      });
    } else {
      console.error('Todos los campos son obligatorios.');
    }
  }
}
