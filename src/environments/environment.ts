// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyApCcGr8TFIvBGIlZCTEu2qUQMX3bwLQhM",
    authDomain: "multiverso-bb294.firebaseapp.com",
    projectId: "multiverso-bb294",
    storageBucket: "multiverso-bb294.appspot.com",
    messagingSenderId: "999295918531",
    appId: "1:999295918531:web:0ce2f9c0762df28f0d9d76",
    measurementId: "G-REHKK8XYGN"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


// environment.ts: Este archivo se utiliza durante el desarrollo. Aquí, la propiedad production se establece en false para indicar que la aplicación se está ejecutando en un entorno de desarrollo. Esto permite que se incluyan herramientas de depuración, mensajes de consola y otras características útiles para los desarrolladores.

// environment.prod.ts: Este archivo se utiliza cuando construyes y despliegas la aplicación en producción. La propiedad production se establece en true para indicar que la aplicación está en un entorno de producción. Esto desactiva ciertas funcionalidades de depuración, optimiza el rendimiento y minimiza el tamaño del código.