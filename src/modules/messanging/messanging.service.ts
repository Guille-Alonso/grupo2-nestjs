import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_PROVIDER, EmailService } from './messanging.types';

@Injectable()
export class MessagingService {
  constructor(@Inject(EMAIL_PROVIDER) private emailService: EmailService) {}

  async sendRegisterUserEmail(input: { from: string; to: string }) {
    const { from, to } = input;
    const subject = 'Bienvenido a la plataforma';
    const body = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Bienvenido a [Nombre de tu plataforma]!</title>
</head>
<body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333;">¡Bienvenido a ApiRestNest!</h2>
        <p>Hola [Nombre del usuario],</p>
        <p>¡Te damos la bienvenida a ApiRestNest! Estamos muy contentos de que te hayas unido a nuestra comunidad.</p>
       
        <p>¡Disfruta de ApiRestNest!</p>
        <p>Atentamente,<br>
        El equipo de grupo 2</p>
    </div>
</body>
</html>`;

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }

  async sendRecoveryPassword(input: { from: string; to: string; url: string }) {
    const { from, to, url } = input;
    const subject = 'Cambio de contraseña';
    const body = `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar Contraseña</title>
</head>
<body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333;">Recuperación de Contraseña</h2>
        <p>Hola,</p>
        <p>Hemos recibido una solicitud para recuperar tu contraseña. Para restablecerla, por favor, haz clic en el siguiente enlace:</p>
        <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
        <p>Si no solicitaste recuperar tu contraseña, puedes ignorar este correo electrónico.</p>
        <p>Gracias,</p>
        <p>grupo 2 :D</p>
    </div>
</body>
</html>`;

    await this.emailService.send({
      from,
      to,
      subject,
      body,
    });
  }
}
