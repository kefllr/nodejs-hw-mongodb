import { ENV_VARS } from "../constans/index.js";
import { env } from "./env.js";
import { saveFileToLocalMachine } from "./saveFileToLocalMachine.js";
import { saveToCloudinary } from "./saveToCloudinary.js";

export const saveFile = async (file) =>{
    let url;
    if (env(ENV_VARS.IS_CLOUDINARY_ENABLED)==='true') {
        url = await saveToCloudinary(file);
    }else{
        url = await saveFileToLocalMachine(file);
    }
    return url;
};