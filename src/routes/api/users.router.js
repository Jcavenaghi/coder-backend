import { Router } from "express";
import UserManager from "../../services/managers/UserManager.js";

import { checkRole } from "../../middlewares/auth.js";

import UserController from "../../controllers/users.controller.js";
const userController = new UserController();
const router = Router();

router.get("/", userController.getUsers)
router.delete("/", userController.deleteOfflineUsers)
router.delete("/:uid", checkRole(["ADMIN"]), userController.deleteUserById)
router.put("/premium/:uid", checkRole(["ADMIN"]), userController.changeRole)

export default router;