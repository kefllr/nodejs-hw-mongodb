import createHttpError from "http-errors";
import { User } from "../db/models/user.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Session } from "../db/models/session.js";


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