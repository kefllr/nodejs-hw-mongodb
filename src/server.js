import express from 'express' ;
import pino from 'pino-http';
import cors from 'cors';
import { env } from './untils/env.js';
import { getContacts, getContactsId } from './services/contacts.js';


const setupServer = () => {
    const app = express();


    app.use(cors());

    app.get('/contacts', async(req, res, )=>{
        const contacts = await getContacts();
        res.json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    });

    app.get('/contacts/:contactId', async(req, res)=>{ 
        console.log(req.params);
        const id = req.params.contactId;
        const contacts = await getContactsId(id);
       
        res.json({
            status: 200,
            message: `Successfully found contact with id ${id}!`,
            data: contacts,
        });
    });

    app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
      );
    
    app.use('*',(req, res) =>{
        res.status(404).json({
            message:'Not found(',
        });
    }); 

    app.use((err, req, res) =>{
        res.status(500).json({
            message: 'Something went wrong',
            error: err.message,
        });
    });

    const PORT = env('PORT',3000) ;
    app.listen(PORT, () =>{
        console.log(`Server is running on port ${PORT}`);
    });
};
export default setupServer;