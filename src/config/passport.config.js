import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import { config } from './config.js';
import userService from '../dao/models/users.js'
import UserManager from '../services/managers/UserManager.js';
import { createHash, validatePassword } from '../utils.js';
import CartManager from '../services/managers/CartManager.js';
import { CustomError } from "../services/customError.service.js";
import { EError } from "../enums/EError.js";
import { generateUserErrorInfo } from "../services/userErrors/userErrorInfo.js"



const LocalStrategy = local.Strategy;
const userManager = new UserManager();
const cartManager = new CartManager();

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, 
        async (req,username, password,done) =>{
            const { first_name, last_name, email,age} = req.body;
            try {
                if (!first_name || !last_name || !email || !age || !password) {
                    CustomError.createError({
                        name: "User create Error",
                        cause: generateUserErrorInfo(req.body),
                        message: "Error creando el usuario",
                        errorCode: EError.INVALID_JSON
                    })
                }
                const user = await userManager.getUserByEmail(username); 
                if(user){
                    req.logger.warning("el usuario ya existe")
                    return done(null,false);
                }
                const products = []
                const items = { products }
                const cart = await cartManager.addCart(items)
                const newUser = {
                    first_name, 
                    last_name, 
                    email, 
                    age,
                    cart: cart._id, 
                    password: createHash(password)
                    
                }
                const result = await userManager.createUser(newUser)
                return done(null, result);

            } catch (error) {
                return done("Error al registrar el usuario: " + error);
            }
        }
    ));
    passport.serializeUser((user,done)=>{
        done(null, user._id)
    });
    passport.deserializeUser( async (id, done)=>{
        const user = await userService.findById(id);
        done(null, user)
    });

    passport.use('login', new LocalStrategy({usernameField:'email'}, async (username, password, done)=>{
        try {
           
            const user = await userManager.getUserByEmail(username);
            if(!user){
                console.log('No existe el usuario');
                return done(null, false);
            }
            if(!validatePassword(password,user)) return done (null, false);
            user.last_connection = Date.now();
            await userManager.updateData(user._id, user)
            return done(null,user);
        } catch (error) {
            return done("Error al intentar ingresar: " + error);
        }

    }));

    passport.use('github', new GitHubStrategy({
        clientID: config.github.clientId,
        clientSecret:config.github.clientSecret,
        callbackURL:'http://localhost:8080/api/session/githubcallback'
    }, async (accesToken, refreshToken, profile, done)=>{
        try {
            const user = await userManager.getUserByEmail(profile._json.email)
            if(!user){
                const email = profile._json.email == null ?  profile._json.username : null;
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: email,
                    age: 18,
                    password: ''
                }
                const result = await userManager.createUser(newUser);
                done(null, result)
            }else{
                //ya existe el usuario
                done(null,user)
            }
        } catch (error) {
            return done(null,error)
        }
    }))


}

export default initializePassport;