import { Contact } from "../db/contact.js";

export const getContacts = async () =>{
    return await Contact.find({});
};
export const getContactsId = async (id) => {
    return await Contact.findById(id);
};