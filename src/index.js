import setupServer from "./server.js";
import initMongoConnection from './db/initMongoConnection.js';
import { Contact } from "./db/models/contact.js";
import { createFolderIfDoesNotExist } from "./untils/createFolderIfNotExist.js";
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from "./constans/index.js";

const bootstrap = async () => {
  await initMongoConnection();
  const Contacts = await Contact.find({});
  console.log(Contacts);
  await createFolderIfDoesNotExist(TEMP_UPLOAD_DIR);
  await createFolderIfDoesNotExist(UPLOAD_DIR);
  setupServer();
};

bootstrap();