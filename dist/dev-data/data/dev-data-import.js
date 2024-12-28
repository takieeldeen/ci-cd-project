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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const tourModel_1 = __importDefault(require("../../models/tourModel"));
dotenv_1.default.config({ path: './config.env' });
const URL = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(URL).then(() => console.log('connected to DB successfully'));
// Import tour data
const data = JSON.parse(fs_1.default.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// Data Insertion to your db
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Importing all your docs...');
        yield tourModel_1.default.create(data);
        console.log('Data Loaded Successfully');
        process.exit();
    }
    catch (err) {
        console.log(err);
    }
});
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Deleting all your docs...');
        yield tourModel_1.default.deleteMany();
        console.log('Data Deleted Successfully');
        process.exit();
    }
    catch (err) {
        console.log(err);
    }
});
const scriptType = (_a = process === null || process === void 0 ? void 0 : process.argv[2]) === null || _a === void 0 ? void 0 : _a.replace('--', '');
const options = {
    import: importData,
    delete: deleteData,
};
if (options[scriptType])
    options[scriptType]();
//# sourceMappingURL=dev-data-import.js.map