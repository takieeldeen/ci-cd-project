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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = require("validator");
const bcrypt_1 = require("bcrypt");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please Enter the user name"],
        minLength: [3, "Username can't be less than 3 letters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter the user email"],
        validate: {
            validator: validator_1.isEmail,
            message: "Please enter a valid email format",
        },
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please enter the user password"],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, "Please enter the password confirmation"],
        validate: {
            // This will Only work in creating new user (Not when reseting password)
            validator: function validatePasswordConfirm(confirmPassword) {
                return this.password === confirmPassword;
            },
        },
        select: false,
    },
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Run the encryption function only if the user is modifying the password
        if (!this.isModified("password"))
            return;
        //   hash the password with 2^12 iterations
        this.password = yield (0, bcrypt_1.hash)(this.password, 12);
        // Remove the confirmation password
        this.confirmPassword = undefined;
        next();
    });
});
userSchema.methods.checkPassword = (userPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, bcrypt_1.compare)(userPassword, hashedPassword);
});
const User = (0, mongoose_1.model)("users", userSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map