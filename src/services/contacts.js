import { Contact } from "../db/models/contact.js";
import { saveFile } from "../untils/saveFile.js";


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
        isFavourite = false,
        userId,
    ) =>{

    const skip = perPage * (page - 1);
    

    const contactFiter = Contact.find();
    if(isFavourite){
        contactFiter.where('isFavourite').equals(isFavourite);
    };
    contactFiter.where('parentId').equals(userId);



    const contactCount = await Contact.find().merge(contactFiter).countDocuments();
    
    const paginationInfo = createPaginationInfo(page,perPage,contactCount);

    const contacts = (await Contact.find().merge(contactFiter).skip(skip).limit(perPage).sort({[sortBy]: sortOrder,}).exec());
    return {
        contacts,
        ...paginationInfo,
    };
};

export const getContactsId = async (contactId) => {
    return await Contact.findOne({_id: contactId});
};

export const createContacts = async ({photo, ...payload}, userId) =>{
  const url = await saveFile(photo);
    return await Contact.create({...payload,parentId: userId,  photoUrl: url});
};

export const deleteContacts = async (contactId, userId) =>{
    return await Contact.findOneAndDelete({_id: contactId, parentId: userId});
};

export const patchContacts = async (
    contactId,
    userId,
    payload,
    options = {},
  ) => {
    const rawResult = await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      payload,
      {
        new: true,
        includeResultMetadata: true,
        ...options,
      },
    );
  
    if (!rawResult || !rawResult.value) return null;
  
    return rawResult.value;
  };
  