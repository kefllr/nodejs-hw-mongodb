import { Contact } from "../db/contact.js";

const createPaginationInfo = (page, perPage, count)=>{
    const totalPages = Math.ceil(count / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return{
        page,
        perPage,
        totalItems: count,
        totalPages,
        hasPreviousPage,
        hasNextPage
    };
};

export const getContacts = async (
        page = 1, 
        perPage = 10, 
        sortBy = '_id', 
        sortOrder = 'asc',
        isFavourite = {}) =>{
    

   

    const skip = perPage * (page - 1);
    

    const contactFiter = Contact.find();
    if(isFavourite){
        contactFiter.where('isFavourite').equals(isFavourite);
    };

    const contactCount = await Contact.find().merge(contactFiter).countDocuments();
    
    const paginationInfo = createPaginationInfo(page,perPage,contactCount);

    const contacts = (await Contact.find().merge(contactFiter).skip(skip).limit(perPage).sort({[sortBy]: sortOrder,}).exec());
    return {
        contacts,
        ...paginationInfo,
    };
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