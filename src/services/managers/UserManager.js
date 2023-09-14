import fs from 'fs'

import __dirname from '../../utils.js';

import userModel from '../../dao/models/users.js'

export default class UserManager {


    async getUsers() {
        try {
            const users = await userModel.find().lean();
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

    async deleteOfflineUsers(date) {
        try {
            const deletedUsers = await userModel.find({ last_connection: { $lt: date } });
            console.log(deletedUsers);
            const deletedEmails = deletedUsers.map(user => user.email);
            const users = await userModel.deleteMany({ last_connection: { $lt: date } });
            return deletedEmails
        } catch (err) {
            throw new Error ("No se pudo borrar los usuario" + err.message)
        }
    }
    async deleteUserById(id) {
        try {
            const result = await userModel.deleteOne({_id:id})
            return result
        } catch(err) {
            throw new Error ("No se pudo eliminar al usuario. " + err.message)
        }
    }
}