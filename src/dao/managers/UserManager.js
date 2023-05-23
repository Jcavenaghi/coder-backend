import fs from 'fs'

import __dirname from '../../utils.js';

import userModel from '../models/users.js'

export default class UserManager {

    async getUser(email, password) {
        // Buscar un producto por su id
        try {
            const user = await userModel.findOne({email,password});
            return user 
        } catch (err) {
            throw new Error("error");
        }

    };

    async createUser(user) {
        try {
            const result = await userModel.create(user);
            console.log(result);
            return result
        } catch (err) {
            throw new Error("error");
        }
    }
}