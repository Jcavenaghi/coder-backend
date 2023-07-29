import { Router } from "express";
import UserManager from "../../services/managers/UserManager.js";

import { checkRole } from "../../middlewares/auth.js";

const userManager = new UserManager();
const router = Router();

router.put("/premium/:uid", checkRole(["ADMIN"]), async (req,res) => {
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
})

export default router;