import jwt from "jsonwebtoken";
import customError from "./error.js";

const verifyToken = (req, res, next) => {
    const token = req.cookies.my_cookie;
    if (!token) {
        next(customError(401, "Unauthorized"));
        return;
    }
    if (token) {
        jwt.verify(token, process.env.JWT_SEC_KEY, (err, theValue) => {
            if (err) return next(customError(403, "Token Expired"));
            req.myValue = theValue;
            next();
        });
    }
};

export default verifyToken;
