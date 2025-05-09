import nodemailer from 'nodemailer';

// Configuración del transporter para enviar correos
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Usa SSL/TLS directamente para conectarte
    auth: {
        user: 'easyride24team@gmail.com',
        pass: ''
    },
    tls: {
        rejectUnauthorized: false // Ignora la verificación de certificados en entornos locales
    }
});

// Función para enviar correos
export const enviarCorreo = (
    destinatario: string,
    asunto: string,
    mensaje: string,
    callback: (err: any) => void
) => {
    const mailOptions = {
        from: 'easyride24team@gmail.com',
        to: destinatario,
        subject: asunto,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img 
                        src="https://res.cloudinary.com/drcm4ufqu/image/upload/v1732040625/logo2_gczuax.webp" 
                        alt="Easy Ride" 
                        style="max-width: 200px; height: auto;" />
                </div>
                <p>${mensaje}</p>
                <br>
                <p style="font-size: 0.9em; color: #666; text-align: center;">
                    © Easy Ride 2024. Todos los derechos reservados.
                </p>
            </div>
        `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error enviando correo:', err);
            return callback(err);
        }
        console.log('Correo enviado:', info.response);
        callback(null);
    });
};
