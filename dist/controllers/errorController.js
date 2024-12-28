"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const handleDatabaseCastError = (error) => {
    const message = `invalid ${error === null || error === void 0 ? void 0 : error.path}:${error === null || error === void 0 ? void 0 : error.value} `;
    return new AppError_1.default(message, 400);
};
const handleDatabaseDuplicateKeyError = (err) => {
    var _a, _b, _c, _d;
    const duplicateFieldName = (_b = Object.keys((_a = err === null || err === void 0 ? void 0 : err.errorResponse) === null || _a === void 0 ? void 0 : _a.keyValue)) === null || _b === void 0 ? void 0 : _b[0];
    const duplicateFieldValue = (_d = (_c = err === null || err === void 0 ? void 0 : err.errorResponse) === null || _c === void 0 ? void 0 : _c.keyValue) === null || _d === void 0 ? void 0 : _d[duplicateFieldName];
    const message = `A tour with ${duplicateFieldName} of ${duplicateFieldValue} already exists`;
    return new AppError_1.default(message, 400);
};
const handleDatabaseValidationError = (err) => {
    var _a;
    const message = (_a = Object.values(err === null || err === void 0 ? void 0 : err.errors)
        .map((error) => error === null || error === void 0 ? void 0 : error.message)) === null || _a === void 0 ? void 0 : _a.join(", ");
    return new AppError_1.default(message, 400);
};
const generateProductionError = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
    else {
        // We want to know about the error in our server logs
        console.error(error);
        // We don't want to leak our Functional Error to the client
        res.status(500).json({
            status: "error",
            message: "Someting Went wrong",
        });
    }
};
const generateDevelopmentError = (error, res) => {
    res.status(error.statusCode).json({
        isOperational: error.isOperational,
        status: error.status,
        message: error.message,
        stack: error.stack,
        error,
    });
};
exports.default = (error, req, res, next) => {
    var _a, _b, _c;
    error.statusCode = (_a = error.statusCode) !== null && _a !== void 0 ? _a : 500;
    error.status = (_b = error.status) !== null && _b !== void 0 ? _b : "error";
    error.isOperational = (_c = error.isOperational) !== null && _c !== void 0 ? _c : false;
    if (process.env.NODE_ENV === "development") {
        generateDevelopmentError(error, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let err = Object.create(Object.getPrototypeOf(error));
        Object.assign(err, error);
        console.log("//////////////////////////////////");
        console.log(err === null || err === void 0 ? void 0 : err.name);
        console.log("//////////////////////////////////");
        if ((err === null || err === void 0 ? void 0 : err.name) === "CastError")
            err = handleDatabaseCastError(err);
        if ((err === null || err === void 0 ? void 0 : err.code) === 11000)
            err = handleDatabaseDuplicateKeyError(err);
        if ((err === null || err === void 0 ? void 0 : err.name) === "ValidationError")
            err = handleDatabaseValidationError(err);
        generateProductionError(err, res);
    }
    next();
};
//# sourceMappingURL=errorController.js.map