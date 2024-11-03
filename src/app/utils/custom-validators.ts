// Importa el tipo AbstractControl desde Angular Forms
import { AbstractControl } from "@angular/forms";

// Clase para validadores personalizados
export class CustomValidators {
    // Método estático para validar que dos valores coincidan
    static matchValues(toCompare: AbstractControl) {
        // Devuelve una función que toma un control como argumento
        return (control: AbstractControl) => {
            // Verifica si el valor del control es diferente al valor del control que se va a comparar
            if (control.value !== toCompare.value) {
                // Si no coinciden, devuelve un objeto con una clave 'noMatch' que indica la falla de la validación
                return { noMatch: true };
            }
            // Si coinciden, devuelve null para indicar que la validación fue exitosa
            return null;
        };
    }
}
