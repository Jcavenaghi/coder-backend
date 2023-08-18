import mongoose from "mongoose"
import Users from "../src/dao/Users.dao.js";
import userModel from "../src/dao/models/users.js";
import { config } from "../src/config/config.js"
import Assert from "assert";

const MONGO = config.mongo.url;

const assert = Assert.strict;

describe ("Testing para la clase User del dao", () =>{
    before(async function(){
        await mongoose.connect(MONGO);
        this.userDao = new Users();
    })

    beforeEach(async function(){
        await userModel.deleteMany()
        this.timeout(10000)
    })

    it("El metodo get de la clase Users debe obtener los usuarios en formato arreglo", async function() {
        const result = await this.userDao.get();
        assert.strictEqual(Array.isArray(result),true);
    })

    it("El dao debe agregar un usuario correctamente a la base de datos", async function(){
        let mockUser = {
            first_name:"Juan",
            last_name: "Gonzalia",
            email:"Juangon@mail.com",
            password: "1234"
        }
        const result = await this.userDao.save(mockUser);

        assert.ok(result._id);
    })

    it("Al agregar un nuevo usuario, éste debe crearse con rol USER", async function(){
        let mockUser = {
            first_name:"Juan",
            last_name: "Gonzalia",
            email:"Juangon@mail.com",
            password: "1234"
        }
        const result = await this.userDao.save(mockUser);
        const userDB = await this.userDao.getBy({email:result.email})
        
        let resultTest = false;
        console.log(userDB)
        if(userDB.role === "USER"){
            resultTest = true;
        }
        assert.strictEqual(resultTest, true)
    })

    it("El Dao puede obtener a un usuario por email", async function(){
        let mockUser = {
            first_name:"Juan",
            last_name: "Gonzalia",
            email:"Juangon@mail.com",
            password: "1234"
        }
        const result = await this.userDao.save(mockUser);
        const userDB = await this.userDao.getBy({email:result.email})

        assert.strictEqual(typeof userDB, 'object')
    })
})