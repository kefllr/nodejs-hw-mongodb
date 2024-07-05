import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    isFavourite: {
        type: Boolean,
        default: false
    },
    contactType: {
        type: String,
        enum: ['work', 'home', 'personal'],
        default: 'personal',
        required: true
    },
    parentId: {type: Schema.ObjectId, required: true},
    photoUrl: {type: String},
}, {
    timestamps: true 
});
export const Contact = model('contacts', contactSchema);