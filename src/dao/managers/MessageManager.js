import fs from 'fs'

import __dirname from '../../utils.js';

import messageModel from '../models/messages.js';


export default class MessageManager {
    async addMessage(data) {
        const {user, message} = data;
        if (!user || !message) {
            return res.status(400).send ({
                msg: 'No se registro el usuario',
                error: 'Datos incompletos'
            })
        }
        const result = await messageModel.create(data)
        const res = await messageModel.find().lean();
        return res;
    }
}