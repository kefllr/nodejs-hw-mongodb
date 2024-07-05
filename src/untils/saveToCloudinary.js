import cloudinary  from 'cloudinary';
import { env } from './env.js';
import { ENV_VARS } from '../constans/index.js';
import fs from "node:fs/promises";

cloudinary.v2.config({
    secure:true, 
    cloud_name: env(ENV_VARS.CLOUDINARY_NAME), 
    api_key: env(ENV_VARS.CLOUDINARY_API_KEY), 
    api_secret:  env(ENV_VARS.CLOUDINARY_API_SECRET),
});

export const saveToCloudinary = async (file) =>{

    const res = await cloudinary.v2.uploader.upload(file.path); 
    await fs.unlink(file.path);
    return res.secure_url;
};