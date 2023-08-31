import fs from 'fs'

import __dirname from '../../utils.js';

import userModel from '../../dao/models/users.js'

export default class UserManager {


    async getUsers() {
        try {
            const users = await userModel.find();
            return users
        } catch(err) {
            throw new Error(`error al obtener los usuarios ` + err.message);
        }
    }
    async getUserById(id) {
        try {
           const user = await userModel.findById(id);
           return user
        } catch (err) {
            throw new Error(`error al obtener un usuario mediante el id ${id}: ` + err.message);
        }
    }
    async getUserByEmail(email) {
        // Buscar un producto por su email
        try {
            const user = await userModel.findOne({email});
            return user 
        } catch (err) {
            throw new Error(`error al obtener un usuario mediante el mail ${email}: ` + err.message);
        }

    };

    async createUser(user) {
        try {
            const result = await userModel.create(user);
            return result
        } catch (err) {
            throw new Error("error al crear usuario: " + err.message);
        }
    }

    async updateData(id, user) {
        try {
            await userModel.updateOne({_id:id},user )
        } catch (err) {
            throw new Error("Error al modificar");
        }
    }
    async updateUser(id, newHashedPassword) {
        try {
            await userModel.updateOne({_id:id},{$set:{password:newHashedPassword}});
        } catch (err) {
            throw new Error("Error al modificar: " + err.message);
        }
        
    }
}