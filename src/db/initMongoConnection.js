import mongoose from "mongoose";
import { env } from "../untils/env.js";
import { ENV_VARS } from "../constans/index.js";
const initMongoConnection = async () =>{
    const conectLink = `mongodb+srv://${env(ENV_VARS.MONGODB_USER)}:${env(ENV_VARS.MONGODB_PASSWORD)}@${env(ENV_VARS.MONGODB_URL)}/${env(ENV_VARS.MONGODB_DB)}?retryWrites=true&w=majority&appName=Cluster0`;
    try {
        await mongoose.connect(conectLink);
    } catch (error) {
        console.log(error);
    }

};
export default initMongoConnection;