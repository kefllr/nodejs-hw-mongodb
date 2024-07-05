import { Router } from "express";
import { ctrlWrapper } from "../untils/ctrlWrapper.js";
import { loginUserControler, logoutUserControler, refreshUserControler, registerUserControler, resetPasswordController, sendResetPasswordEmail } from "../controllers/auth.js";
import { regUserSchema } from "../validation/regUserSchema.js";
import { validateBody } from "../middlewares/validateBody.js";
import { logUserSchema } from "../validation/logUserSchema.js";
import { sendResetPasswordSchema } from "../validation/sendResetPasswordSchema.js";
import { resetPasswordSchema } from "../validation/resetPasswordValidation.js";

const authRouter = Router();

authRouter.post('/register',validateBody(regUserSchema), ctrlWrapper(registerUserControler));
authRouter.post('/login',validateBody(logUserSchema), ctrlWrapper(loginUserControler));
authRouter.post('/refresh', ctrlWrapper(refreshUserControler));
authRouter.post('/logout', ctrlWrapper(logoutUserControler));
authRouter.post('/send-reset-email',validateBody(sendResetPasswordSchema), ctrlWrapper(sendResetPasswordEmail));
authRouter.post('/reset-pwd',validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default authRouter;