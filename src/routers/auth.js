import { Router } from "express";
import { ctrlWrapper } from "../untils/ctrlWrapper.js";
import { loginUserControler, logoutUserControler, refreshUserControler, registerUserController } from "../controllers/auth.js";
import { regUserSchema } from "../validation/regUserSchema.js";
import { validateBody } from "../middlewares/validateBody.js";
import { logUserSchema } from "../validation/logUserSchema.js";

const authRouter = Router();

authRouter.post('/register',validateBody(regUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/login',validateBody(logUserSchema), ctrlWrapper(loginUserControler));
authRouter.post('/refresh', ctrlWrapper(refreshUserControler));
authRouter.post('/logout', ctrlWrapper(logoutUserControler));

export default authRouter;