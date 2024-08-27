import { AbstractControl } from "@angular/forms";


export class CustomValidators{

    static matchValues(toCompare: AbstractControl){
        return (control: AbstractControl) => {
            if(control.value !== toCompare.value) return { noMatch: true }
            return null
        }
    }

}