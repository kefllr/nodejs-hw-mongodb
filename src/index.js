import setupServer from "./server.js";
import initMongoConnection from './db/initMongoConnection.js';
import { Contact } from "./db/contact.js";

const bootstrap = async () => {
  await initMongoConnection();
  const Contacts = await Contact.find({});
  console.log(Contacts);
  setupServer();
};

bootstrap();