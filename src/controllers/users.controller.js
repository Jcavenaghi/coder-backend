import UserManager from "../services/managers/UserManager.js"
import { GetUserDto } from "../dao/dto/user.dto.js";
import { sendDeleteUserMail  } from "../config/gmail_config.js";
const userManager = new UserManager();
class UserController { 

    getUsers = async (req,res) => {
        const users = await userManager.getUsers();
        const usersDto = [];
        for (let index = 0; index < users.length; index++) {
            usersDto[index] = new GetUserDto(users[index])
        }
        return res.status(200).send ({
            status: 'success',
            usersDto
        })
    }

    deleteOfflineUsers = async (req, res) => {
        const dosDiasAtras = new Date();
        dosDiasAtras.setDate(dosDiasAtras.getDate() - 2);
        const usersEmails = await userManager.deleteOfflineUsers(dosDiasAtras);
        for (const email of usersEmails) {
            await sendDeleteUserMail(email);
        }
;       res.status(200).send ({
            status: "success",
            usersEmails
        })
    };
    changeRole = async (req,res) => {
        try {
            const userId = req.params.uid;
    
            const user = await userManager.getUserById(userId);
            const userRol = user.role;
            if (userRol === "USER") {
                user.role = "PREMIUM";
            } else if (userRol === "PREMIUM") {
                user.role = "USER"
            } else {
                return res.json({status:"error", message:"No es posible cambiar el rol"})
            }
            await userManager.updateData(userId,user)
            res.json({status:"success", message: "Update exitoso."});
        } catch(error) {
            return res.json({status:"error", message:"Existe un error al modificar el rol"})
        }
    }

    deleteUserById = async (req, res) => {
        try {

            const userId = req.params.uid
            const result = await userManager.deleteUserById(userId)
            res.json({status:"success", message: "Borrado exitoso."});
        } catch (err) {
            return res.json({status:"error", message:"Existe un error al eliminar usuario"})
        }
    }
}

export default UserController
