import cloudinary  from 'cloudinary';
import { env } from './env.js';




cloudinary.v2.config({
    secure:true, 
    cloud_name: env('CLOUDINARY_NAME'),
    api_key: env('CLOUDINARY_API_KEY'),
    api_secret: env('CLOUDINARY_API_SECRET')
});

const saveToCloudinary = async (file) =>{

    const res = await cloudinary.v2.uploader.upload(file.path); 
    return res.secure_url;
};
export default saveToCloudinary;