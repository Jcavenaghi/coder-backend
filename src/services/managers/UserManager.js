import fs from 'fs'

import __dirname from '../../utils.js';

import userModel from '../../dao/models/users.js'

export default class UserManager {

    async getUserById(id) {
        try {
           const user = await userModel.findById(id);
           return user
        } catch (err) {
            throw new Error("error");
        }
    }
    async getUserByEmail(email) {
        // Buscar un producto por su email
        try {
            const user = await userModel.findOne({email});
            return user 
        } catch (err) {
            throw new Error("error");
        }

    };

    async createUser(user) {
        try {
            const result = await userModel.create(user);
            return result
        } catch (err) {
            throw new Error("error");
        }
    }

    async updateUser(id, newHashedPassword) {
        try {
            await userModel.updateOne({_id:id},{$set:{password:newHashedPassword}});
        } catch (err) {
            throw new Error("Error al modificar")
        }
        
    }
}