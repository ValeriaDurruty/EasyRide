"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarCorreo = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configuración del transporter para enviar correos
const transporter = nodemailer_1.default.createTransport({
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
const enviarCorreo = (destinatario, asunto, mensaje, callback) => {
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
exports.enviarCorreo = enviarCorreo;
