"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _1 = require(".");
const userRouter = express_1.default.Router();
userRouter
    .route('/')
    .get(_1.userController.useGetUsers)
    .post(_1.userController.createUser);
userRouter
    .route('/:id')
    .get(_1.userController.useGetUser)
    .patch(_1.userController.updateUser)
    .delete(_1.userController.deleteUser);
exports.default = userRouter;
//# sourceMappingURL=routers.js.map