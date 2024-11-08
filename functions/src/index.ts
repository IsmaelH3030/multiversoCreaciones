import * as functions from 'firebase-functions';
const nodemailer = require('nodemailer'); // Usamos require para evitar el problema

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'Multiverso_creaciones2@hotmail.com',
    pass: '33Shadow00*##'
  }
});

export const sendContactForm = functions.https.onCall((data, context) => {
  // Desestructurar los datos enviados desde la aplicación
  const { name, email, message, imageUrl } = data;

  // Verificar si los datos requeridos están presentes
  if (!name || !email || !message) {
    throw new functions.https.HttpsError('invalid-argument', 'Faltan campos obligatorios');
  }

  const mailOptions = {
    from: email,
    to: 'Multiverso_creaciones2@hotmail.com',
    subject: `Nuevo mensaje de ${name}`,
    html: `
      <h1>Mensaje de ${name}</h1>
      <p>Email: ${email}</p>
      <p>Mensaje: ${message}</p>
      <p>Imagen sugerida: <img src="${imageUrl}" alt="Imagen sugerida"></p>
    `
  };

  // Enviar el correo
  return transporter.sendMail(mailOptions)
    .then(() => {
      return { message: 'Correo enviado exitosamente' };
    })
    .catch((error: Error) => { // Asegúrate de especificar el tipo correcto de error
      console.error('Error al enviar el correo:', error);
      throw new functions.https.HttpsError('internal', 'Error al enviar el correo', error.message);
    });
});
