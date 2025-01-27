import { Router } from "express";
import { login, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const userRouter = Router();

userRouter.post('/register' , register);
userRouter.post('/login' , login);
userRouter.put('/update-profile' , isAuthenticated , updateProfile);

export default userRouter;