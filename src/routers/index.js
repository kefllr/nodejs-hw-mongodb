import { Router } from "express";
import contactRouter from "./contacts.js";
import authRouter from "./auth.js";

const rootRouter = Router();

rootRouter.use('/contacts', contactRouter);
rootRouter.use('/auth', authRouter);

export default rootRouter;