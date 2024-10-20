import nodemailer from 'nodemailer';

// Configuración del transporter para enviar correos
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Usa SSL/TLS directamente para conectarte
    auth: {
        user: 'easyride24team@gmail.com',
        pass: 'dqji ksgl dsrm emiw'
    },
    tls: {
        rejectUnauthorized: false // Ignora la verificación de certificados en entornos locales
    }
});

// Función para enviar correos
export const enviarCorreo = (destinatario: string, asunto: string, mensaje: string, callback: (err: any) => void) => {
    const mailOptions = {
        from: 'easyride24team@gmail.com',
        to: destinatario,
        subject: asunto,
        text: mensaje
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
