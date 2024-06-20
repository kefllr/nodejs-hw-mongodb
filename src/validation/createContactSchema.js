import Joi from "joi";

const createContactSchema = Joi.object({
    name: Joi.string().required().min(2).max(20),
    phoneNumber: Joi.string().required().min(2).max(20),
    email: Joi.string().required().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid('work', 'home', 'personal')
});
export default createContactSchema;