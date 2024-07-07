import { createUser, loginUser, logoutUser, refreshSession } from "../services/auth.js";

const setupSession = (res, session) =>{
    res.cookie('sessionId', session._id,{
        httpOnly: true,
        expire: 30 * 24 * 60 * 60
    });
    res.cookie('sessionToken', session.refreshToken,{
        httpOnly: true,
        expire: 30 * 24 * 60 * 60
    });
};

export const registerUserController = async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json({
            status: 201,
            message: 'Successfully registered a user!',
            data: { user },
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error registering user',
            error: error.message,
        });
    }
};

export const loginUserControler= async (req, res) => {

    const session = await loginUser(req.body);

    setupSession(res, session);

    res.json({
        status: 200,
        message:'Successfully logged in an user!',
        data: {accessToken: session.accessToken},
    });
};

export const logoutUserControler= async (req, res) => {
    await logoutUser({
        sessionId:req.cookies.sessionId, 
        sessionToken:req.cookies.sessionToken
    });
    res.clearCookie('sessionId');
    res.clearCookie('sessionToken');

    res.status(204).send();
};

export const refreshUserControler = async (req, res) =>{
    const {sessionId, sessionToken} = req.cookies;
    const session = await refreshSession({sessionId, sessionToken});

    setupSession(res, session);
    res.json({
        status: 200,
        message:'Successfully refreshed a session!',
        data: {accessToken: session.accessToken},
    });
};
