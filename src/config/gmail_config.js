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
//Funcion para el envio de correo electronico para recuperar la contraseña

export const sendRecoveryPass = async(userEmail,token)=>{

    const link = `http://localhost:8080/resetPassword?token=${token}`;
    await transporter.sendMail({
        from: "adminEmail",
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

export const sendDeleteUserMail = async(userEmail) =>{
    await transporter.sendMail({
        from: "Ecommerce Parfumerie ARG",
        to:userEmail,
        subject:"Usuario eliminado",
        html: `
        <div>
        <h2>Su usuario ha sido eliminado</h2>
        <p>Su usuario ha sido eliminado debido a inactividad en el sistema (más de dos dias sin conexión).</p>
        </a>        
        </div>
        `
    })
}

export const sendDeleteUserProduct = async(userEmail) =>{
    await transporter.sendMail({
        from: "Ecommerce Parfumerie ARG",
        to:userEmail,
        subject:"Se elimino uno de sus productos",
        html: `
        <div>
        <h2>Un producto ha sido eliminado</h2>
        <p>Se ha eliminado un producto que pertenecia a usted. Está accion fue realizada por un administrador, o por usted.</p>
        </a>        
        </div>
        `
    })
}


