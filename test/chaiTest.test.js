import mongoose from "mongoose";
import Users from "../src/dao/Users.dao.js";
import chai from "chai";
import userModel from "../src/dao/models/users.js";
import { config } from "../src/config/config.js"

const MONGO = config.mongo.url;

const expect = chai.expect;

//Generar el contexto descreibe 
describe("Testing para la clase User dao", ()=>{

    before(async function(){
        await mongoose.connect(MONGO);
        this.userDao = new Users();
    })

    beforeEach(async function(){
        await userModel.deleteMany();
        this.timeout(10000)
    })

    it("El metodo get de la clase Users debe obtener los usuarios en formato arreglo", async function(){
        const result = await this.userDao.get();
        
        expect(result).to.be.deep.equal([])
    })

    it("El dao debe agregar un usuario correctamente a la base de datos", async function(){
        let mockUser = {
            first_name:"Pepe",
            last_name: "Perez",
            email:"pepeperez@mail.com",
            password: "1234"
        }
        const result = await this.userDao.save(mockUser);
        expect(result).to.have.property("_id");
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
        if(userDB.role === "USER"){
            resultTest = true;
        }
        expect(userDB).to.have.property("role")
    })

    it("El dao puede actualizar un usuario por id", async function(){
        let mockUser = {
            first_name:"Pepe",
            last_name: "Perez",
            email:"pepeperez@mail.com",
            password: "1234"
        }
        const result = await this.userDao.save(mockUser);
        const userDB = await this.userDao.getBy({email:result.email})

        userDB.first_name = "pepe modificado";
        await this.userDao.update(userDB._id,userDB)
        const userDB2 = await this.userDao.getBy({email:result.email})
        expect(userDB2.first_name).to.be.equal("pepe modificado")

    })

})