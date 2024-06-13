import { Contact } from "../db/contact.js";

export const getContacts = async () =>{
    return await Contact.find({});
};
export const getContactsId = async (id) => {
    return await Contact.findById(id);
};

export const createContacts = async (payload) =>{
    return await Contact.create(payload);
};

export const deleteContacts = async (id) =>{
    return await Contact.findByIdAndDelete(id);
};

export const patchContacts = async (contactId, payload, options = {}) => {
    const rawResult = await Contact.findOneAndUpdate(
      { _id: contactId },
      payload,
      {
        new: true,
        includeResultMetadata: true,
        ...options,
      },
    );
    if (!rawResult || !rawResult.value) return null;
    return {
      contact: rawResult.value,
      isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
  };