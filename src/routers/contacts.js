import { Router } from "express";

import { contactsController, contactsIdController, createContactControler, deleteContactControler, patchContactControler } from "../controllers/contacts.js";
import { ctrlWrapper } from "../untils/ctrlWrapper.js";
import validateId from "../middlewares/validateId.js";
import {validateBody} from "../middlewares/validateBody.js";
import {createContactSchema, updateContactSchema } from "../validation/createContactSchema.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

 const contactRouter = Router();

contactRouter.use('/', authenticate);

contactRouter.get('/', ctrlWrapper(contactsController));

contactRouter.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactControler));

contactRouter.get('/:contactId', validateId('contactId'), ctrlWrapper(contactsIdController));

contactRouter.delete('/:contactId',validateId('contactId'), ctrlWrapper(deleteContactControler));

contactRouter.patch('/:contactId',upload.single('photo'),validateBody(updateContactSchema),validateId('contactId'), ctrlWrapper(patchContactControler));



export default contactRouter;