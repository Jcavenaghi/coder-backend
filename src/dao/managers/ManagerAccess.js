import fs from 'fs'

import __dirname from '../../utils.js';

export default class ManagerAccess {
    
    async crearRegistro(metodo) {
        const fecha = new Date().toLocaleDateString();
        const hora = new Date().toLocaleTimeString();
        const msg = `\nFecha: ${fecha} -  Hora: ${hora} - Metodo: ${metodo}`;
        await fs.promises.appendFile( __dirname +'/dao/managers/log.txt',msg,(err)=>{
            console.log(err);
            return err;
        })
    }
}