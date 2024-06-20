import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";

const validateId = (idName = 'id') => (req, res, next) => {
    const id = req.params[idName];
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid Id'));
    }
    return next();
};
export default validateId;