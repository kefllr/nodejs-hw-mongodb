import { OAuth2Client } from "google-auth-library";
import { ENV_VARS } from "../constans/index.js";
import { env } from "./env.js";
import fs from 'node:fs';
import path from "node:path";
import createHttpError from "http-errors";

const googleConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'google.json')).toString());

const client = new OAuth2Client({
    clientId: env(ENV_VARS.GOOGLE_CLIENT_ID),
    clientSecret: env(ENV_VARS.GOOGLE_CLIENT_SECRET),
    project_id: googleConfig.web.project_id,
    redirectUri: googleConfig.web.redirect_uris[0],
});

export const generateOAuthURL = () =>{
    return client.generateAuthUrl({
        scope:['https://www.googleapis.com/auth/userinfo.email',
               'https://www.googleapis.com/auth/userinfo.profile']
    });
};

export const validateCode = async (code) => {
    const response = await client.getToken(code);
    if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');
  
    const ticket = await client.verifyIdToken({
      idToken: response.tokens.id_token,
    });
    return ticket;
  };
  
  export const getFullNameFromGoogleTokenPayload = (payload) => {
    let fullName = 'Guest';
    if (payload.given_name && payload.family_name) {
      fullName = `${payload.given_name} ${payload.family_name}`;
    } else if (payload.given_name) {
      fullName = payload.given_name;
    }
  
    return fullName;
  };