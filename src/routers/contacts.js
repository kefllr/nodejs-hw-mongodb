import { Router } from "express";

import { contactsController, contactsIdController, createContactControler, deleteContactControler, patchContactControler } from "../controllers/contacts.js";
import { ctrlWrapper } from "../untils/ctrlWrapper.js";
import validateId from "../middlewares/validateId.js";
import {validateBody} from "../middlewares/validateBody.js";
import createContactSchema from "../validation/createContactSchema.js";

 const contactRouter = Router();


contactRouter.get('/contacts', ctrlWrapper(contactsController));

contactRouter.post('/contacts',validateBody(createContactSchema), ctrlWrapper(createContactControler));

contactRouter.get('/contacts/:contactId',validateId('contactId'), ctrlWrapper(contactsIdController));

contactRouter.delete('/contacts/:contactId',validateId('contactId'), ctrlWrapper(deleteContactControler));

contactRouter.patch('/contacts/:contactId',validateBody(createContactSchema),validateId('contactId'), ctrlWrapper(patchContactControler));

export default contactRouter;