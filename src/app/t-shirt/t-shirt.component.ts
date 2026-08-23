import { Component, OnInit, ViewChild } from '@angular/core'; 
import { NgForm } from '@angular/forms';
import { TShirtService } from '../services/t-shirt.service'; 
import { TShirt } from '../models/user.model'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-t-shirt', 
  templateUrl: './t-shirt.component.html', 
  styleUrls: ['./t-shirt.component.scss'] 
})
export class TShirtComponent implements OnInit {
  @ViewChild('tShirtForm') tShirtForm!: NgForm;

  tshirts: TShirt[] = []; 
  selectedTShirt: TShirt = { material: '', size: '' }; 
  isLoading: boolean = true; 

  constructor(
    private tShirtService: TShirtService, 
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.loadTShirts();
  }

  ionViewWillEnter() {
    this.loadTShirts();
  }

  loadTShirts() {
    this.isLoading = true;
    this.tShirtService.getTShirts().subscribe({
      next: (tshirts) => {
        this.tshirts = tshirts; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // Carga de imagen optimizada al tamaño real de las tarjetas (400px máximo)
  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          // Ajustado a 400px para encajar con las tarjetas (250px max-width)
          const maxWidth = 400;
          const maxHeight = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convierte a JPEG comprimido al 70% (~30 KB a 50 KB)
          this.selectedTShirt.imageUrl = canvas.toDataURL('image/jpeg', 0.7);
        };
      };
      reader.readAsDataURL(file);
    }
  }

  async createOrUpdateTShirt() {
    if ((this.tShirtForm && this.tShirtForm.invalid) || !this.selectedTShirt.imageUrl) {
      return;
    }

    const user = await this.afAuth.currentUser;
    if (!user) {
      alert('Debes iniciar sesión para realizar esta operación.');
      return;
    }

    try {
      if (this.selectedTShirt.id) {
        await this.tShirtService.updateTShirt(this.selectedTShirt);
      } else {
        await this.tShirtService.createTShirt(this.selectedTShirt);
      }
      this.resetForm();
    } catch (error: any) {
      console.error('Error en la operación:', error);
      alert(`Error al procesar la camiseta: ${error.message}`);
    }
  }

  editTShirt(tshirt: TShirt) {
    this.selectedTShirt = { ...tshirt }; 
  }

  async deleteTShirt(tshirt: TShirt) {
    const user = await this.afAuth.currentUser;
    if (!user) {
      alert('Debes iniciar sesión para realizar esta operación.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta camiseta?')) {
      this.tShirtService.deleteTShirt(tshirt.id ?? '')
        .then(() => {
          if (this.selectedTShirt.id === tshirt.id) {
            this.resetForm();
          }
        })
        .catch(error => {
          console.error('Error al eliminar:', error);
          alert(`Error al eliminar: ${error.message}`);
        });
    }
  }

  resetForm() {
    this.selectedTShirt = { material: '', size: '' }; 
    if (this.tShirtForm) {
      this.tShirtForm.resetForm();
    }
  }
}