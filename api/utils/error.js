const customError = (status, message) => {
    const e = new Error();
    e.message = message;
    e.statusCode = status;
    return e;
};

export default customError;
