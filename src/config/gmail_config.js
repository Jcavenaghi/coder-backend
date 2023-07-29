import nodemailer from "nodemailer";
import { config } from './config.js';

//Credenciales de la cuenta de GMAIL
const adminEmail = config.gmail.adminAccount;
const adminPass = config.gmail.adminPassword;

//Configuracion del canal de comunicación entre node y gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    // host:"smtp.gmail.com",
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
//Funcion para el envio de correo electronico para recuperar la contraseña

export const sendRecoveryPass = async(userEmail,token)=>{

    const link = `http://localhost:8080/reset-password?token=${token}`;
    await transporter.sendMail({
        from: adminEmail,
        to:userEmail,
        subject:"Restablecer contraseña",
        html: `
        <div>
        <h2>Has solicitado un cambio de contraseña.</h2>
        <p>Da clic en el siguiente enlace para restableces la contraseña</p>
        <a href="${link}">
        <button> Restablecer contraseña </button>
        </a>        
        </div>
        `
    })

};

