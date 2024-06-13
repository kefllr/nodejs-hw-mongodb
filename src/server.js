import express from 'express' ;
import pino from 'pino-http';
import cors from 'cors';
import { env } from './untils/env.js';
import contactRouter from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';


const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(contactRouter);

    app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
      );
    
    app.use('*', notFoundHandler); 

    app.use(errorHandler);

    const PORT = Number(env('PORT', '3000'));

    app.listen(PORT, () =>{
        console.log(`Server is running on port ${PORT}`);
    });
};
export default setupServer;