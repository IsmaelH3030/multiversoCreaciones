import { Component, OnInit } from '@angular/core'; 
import { TShirtService } from '../services/t-shirt.service'; 
import { TShirt } from '../models/user.model'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-t-shirt', 
  templateUrl: './t-shirt.component.html', 
  styleUrls: ['./t-shirt.component.scss'] 
})
export class TShirtComponent implements OnInit {
  tshirts: TShirt[] = []; 
  selectedTShirt: TShirt = { material: '', size: '' }; 

  constructor(
    private tShirtService: TShirtService, 
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.loadTShirts(); 
  }

  loadTShirts() {
    this.tShirtService.getTShirts().subscribe(tshirts => {
      this.tshirts = tshirts; 
    });
  }

  // Convierte el archivo seleccionado del PC a Base64
  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar que no supere 800 KB para no saturar Firestore
      if (file.size > 800 * 1024) {
        alert('La imagen es muy pesada. Selecciona una de menos de 800 KB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        // Asigna la cadena Base64 directamente a la propiedad imageUrl
        this.selectedTShirt.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async createOrUpdateTShirt() {
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
  }
}