"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const catchAsync_1 = require("../../utils/catchAsync");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const token_1 = require("../../utils/token");
/**
 * Register new user
 */
exports.signup = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    };
    const user = yield userModel_1.default.create(userData);
    const token = (0, token_1.generateNewToken)(user === null || user === void 0 ? void 0 : user.id);
    res.status(201).json({
        status: "success",
        data: {
            token,
        },
    });
    next();
}));
exports.signin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Case 1 : No Email or Password
    if (!email || !password)
        return next(new AppError_1.default("Please enter email and Password", 400));
    const user = yield userModel_1.default.findOne({ email }).select("+password");
    // Case 2 : No User found with these credentials
    if (!user)
        return next(new AppError_1.default("Wrong Credentials", 401));
    // Case 3 : Wrong password
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authenticated = yield user.checkPassword(password, user === null || user === void 0 ? void 0 : user.password);
    if (!authenticated)
        return next(new AppError_1.default("Wrong Credentials", 401));
    // Case 4 : Correct credentials
    const token = (0, token_1.generateNewToken)(user === null || user === void 0 ? void 0 : user.id);
    res.status(200).json({
        status: "success",
        token,
    });
}));
//# sourceMappingURL=authController.js.map