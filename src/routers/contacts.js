import { Router } from "express";

import { contactsController, contactsIdController, createContactControler, deleteContactControler, patchContactControler } from "../controllers/contacts.js";
import { ctrlWrapper } from "../untils/ctrlWrapper.js";

 const contactRouter = Router();


contactRouter.get('/contacts', ctrlWrapper(contactsController));

contactRouter.post('/contacts', ctrlWrapper(createContactControler));

contactRouter.get('/contacts/:contactId', ctrlWrapper(contactsIdController));

contactRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactControler));

contactRouter.patch('/contacts/:contactId', ctrlWrapper(patchContactControler));

export default contactRouter;