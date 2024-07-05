import { createContacts, deleteContacts, getContacts, patchContacts } from "../services/contacts.js";
import { getContactsId } from "../services/contacts.js";
import createHttpError from 'http-errors';
import mongoose from "mongoose";
import { parsePaginationParams } from "../untils/parsePaginationParams.js";

import { saveToCloudinary } from "../untils/saveToCloudinary.js";
import { saveFileToLocalMachine } from "../untils/saveFileToLocalMachine.js";
import { env } from "../untils/env.js";



export const contactsController = async(req, res, )=>{
    const {page, perPage} = parsePaginationParams(req.query);
    const {sortBy, sortOrder} = req.query;
    const {isFavourite} = req.query;
    const userId = req.user._id;

    const contacts = await getContacts(page, perPage, sortBy, sortOrder, isFavourite, userId);
    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};

export const createContactControler = async(req, res) =>{
    const {body, file} = req;
    const contacts = await createContacts({...body, photo: file}, req.user._id) ;

    res.status(201).json({
        status: 201,
        message: 'Successfully create contact !',
        data: contacts,
    });

};

export const deleteContactControler = async(req, res, next) =>{
    const id = req.params.contactId;
     const contact = await deleteContacts(id, req.user._id);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
      }

    res.status(204).send();

};

export const patchContactControler = async(req, res) =>{
    const { contactId } = req.params;
    const photo = req.file;
    const userId = req.user._id;

    let photoUrl;

    if (photo) {
        if (env('IS_CLOUDINARY_ENABLED') === 'true') {
        photoUrl = await saveToCloudinary(photo);
        } else {
        photoUrl = await saveFileToLocalMachine(photo);
        }
    }

    const patch = req.body;

    const result = await patchContacts(contactId, userId, {
        ...patch,
        photo: photoUrl,
    });

    if (!result || !contactId) {
        return res.status(404).json({
        status: '404',
        message: 'Contact not found',
        data: null,
        });
    }

    res.status(200).json({
        status: '200',
        message: 'Successfully patched a contact!',
        data: result,
    });
  };



export const contactsIdController = async (req, res) => {
    try {
        const id = req.params.contactId;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                status: 400,
                message: `Invalid contact ID format: ${id}`
            });
        }

        const contact = await getContactsId(id);

        if (contact) {
            res.json({
                status: 200,
                message: `Successfully found contact with id ${id}!`,
                data: contact,
            });
        } else {
            res.status(404).json({
                status: 404,
                message: `Not found contact with id ${id}!`,
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'Error retrieving contact',
            error: err.message,
        });
    }
};