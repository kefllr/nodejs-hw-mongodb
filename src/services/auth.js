import createHttpError from "http-errors";
import { User } from "../db/models/user.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Session } from "../db/models/session.js";
import jwt from 'jsonwebtoken';
import { env } from "../untils/env.js";
import { ENV_VARS, TEMPLATE_DIR } from "../constans/index.js";
import { sendMail } from "../untils/sendMail.js";
import Handlebars from "handlebars";
import fs from 'node:fs/promises';
import path from 'node:path';
import { validateGoogleOAuthCode } from "../untils/googleOAuth.js";



const createSession = () => {
    const accessToken = crypto.randomBytes(30).toString('base64');
    const refreshToken = crypto.randomBytes(30).toString('base64');
  
    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: Date.now() + 1000 * 60 * 15 ,
      refreshTokenValidUntil: Date.now() + 1000 * 60 * 60 * 30
    };
  };

export const createUser = async (payload) =>{

    const hashedPassword = await bcrypt.hash(payload.password,10);

    return await User.create({
        ...payload,
        password: hashedPassword,
}   );
};

export const loginUser = async ({email, password})=>{
    const user = await User.findOne({email});

    if(!user){
        throw createHttpError(404, 'User not found');
    };

    const areEqual = await bcrypt.compare(password, user.password);

    if(!areEqual){
        throw createHttpError(401, 'Unauthorized');
    };


    await Session.deleteOne({userId: user._id});

    const sessionData = createSession();

    return await Session.create({
        userId: user._id,
        ...sessionData
    });
};

export const logoutUser = async ({sessionId, sessionToken}) =>{
    return await Session.deleteOne({_id: sessionId, refreshToken:sessionToken});
};


export const refreshSession = async ({sessionId, sessionToken}) =>{
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken: sessionToken
    });

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }
    if (new Date() > session.refreshTokenValidUntil) {
        throw createHttpError(401, 'Session token is expired');
    }

    const user = await User.findById(session.userId);

    if (!user) {
        throw createHttpError(401, 'Session not found');
    }

    await Session.deleteOne({ _id: sessionId });
    const newSessionData = createSession();

    return await Session.create({
        userId: user._id,
        ...newSessionData
    });
};

export const sendResetPassword = async (email) =>{
    const user = await User.findOne({email});
    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    const token = jwt.sign(
        {
          sub: user._id,
          email,
        },
        env(ENV_VARS.JWT_SECRET),
        {
          expiresIn: '5m',
        },
      );

      const templateSource = await fs.readFile(path.join(TEMPLATE_DIR, 'send-reset-password.html'));

      const template = Handlebars.compile(templateSource.toString());

      const html = template({
        name: user.name,
        link: `${env(ENV_VARS.APP_DOMAIN)}/send-reset-email?token=${token}`
      });

    try {
         await sendMail({
        html,
        to: email,
        from: env(ENV_VARS.SMTP_FROM),
        subject: 'reset u pasword'
    });
    } catch (error) {
        console.log(error);
        throw createHttpError(500, 'problem with sending email');
    }
   
};

export const resetPassword = async ({token, password}) =>{
    let tokenPayload;
    try{
        tokenPayload = jwt.verify(token, env(ENV_VARS.JWT_SECRET));
    }catch(err){
       throw createHttpError(401, err.message);
    };
    

    const hashPassword = await bcrypt.hash(password, 10);
    
    await User.findOneAndUpdate({
        _id: tokenPayload.sub, 
        email: tokenPayload.email
    },{password:hashPassword},
    {new: true}
);
};

export const loginOrSignupWithGoogleOAuth = async (code) => {
  const payload = await validateGoogleOAuthCode(code);

  if (!payload) throw createHttpError(401);

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    const hashedPassword = await bcrypt.hash(
      crypto.randomBytes(40).toString('base64'),
      10,
    );

    user = await User.create({
      name: payload.given_name + ' ' + payload.family_name,
      email: payload.email,
      password: hashedPassword,
    });
  }

  await Session.deleteOne({
    userId: user._id,
  });

  return await Session.create({
    userId: user._id,
    ...createSession(),
  });
};