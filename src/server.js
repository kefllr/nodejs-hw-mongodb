import express from 'express' ;
import pino from 'pino-http';
import cors from 'cors';
import { env } from './untils/env.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import rootRouter from './routers/index.js';
import cookiesParser from 'cookie-parser';
import { UPLOAD_DIR } from './constans/index.js';


const setupServer = () => {
    const app = express();

    app.use(express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }));
    app.use(cors());

    app.use(cookiesParser());

    app.use('/upload', express.static(UPLOAD_DIR));

    app.use(rootRouter);

    app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
      );

      app.get('/', (req, res) => {
        res.json({
          message: 'Hello World!',
        });
      });
    
    app.use('*', notFoundHandler); 

    app.use(errorHandler);

    const PORT = Number(env('PORT', '3000'));

    app.listen(PORT, () =>{
        console.log(`Server is running on port ${PORT}`);
    });
};
export default setupServer;