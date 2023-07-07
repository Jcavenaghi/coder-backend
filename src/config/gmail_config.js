import nodemailer from "nodemailer";
import { config } from './config.js';

//Credenciales de la cuenta de GMAIL
const adminEmail = config.gmail.adminAccount;
const adminPass = config.gmail.adminPassword;


//Configuracion del canal de comunicación entre node y gmail
const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    auth:{
        user: adminEmail,
        pass: adminPass
    },
    secure: false,
    tls:{
        rejectUnauthorized: false
    }
})

export { transporter }