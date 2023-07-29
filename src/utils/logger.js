import winston from "winston";
import * as dotenv from "dotenv";
import __dirname from "../utils.js"
import path from "path";
dotenv.config();

const CustomLevelOptions =  {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        http: 'lightblue',
        debug: 'white'
    }
}

const devLogger = winston.createLogger({
    levels:CustomLevelOptions.levels,
    transports:[
        new winston.transports.Console({level:"debug"})
    ]
});

const prodLogger = winston.createLogger({
    levels:CustomLevelOptions.levels,
    transports:[
        //definir los diferentes sistemas de almacenamiento de logs(mensajes/registros)
        new winston.transports.Console({ level: "info"}),
        new winston.transports.File({filename: path.join(__dirname,"/logs/errors.log"), level:"info" })
    ]
});

const currentEnv = process.env.NODE_ENV || "development";

//crear un middleware para agregar el logger al objeto req
export const addLogger = (req,res,next)=>{
    if(currentEnv === "development"){
        req.logger = devLogger;
    } else {
        req.logger = prodLogger;
    }
    req.logger.http(`${req.url} - method: ${req.method}`);
    next();
}