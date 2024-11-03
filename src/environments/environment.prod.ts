export const environment = {
  production: true,
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

// environment.ts: Este archivo se utiliza durante el desarrollo. Aquí, la propiedad production se establece en false para indicar que la aplicación se está ejecutando en un entorno de desarrollo. Esto permite que se incluyan herramientas de depuración, mensajes de consola y otras características útiles para los desarrolladores.

// environment.prod.ts: Este archivo se utiliza cuando construyes y despliegas la aplicación en producción. La propiedad production se establece en true para indicar que la aplicación está en un entorno de producción. Esto desactiva ciertas funcionalidades de depuración, optimiza el rendimiento y minimiza el tamaño del código.