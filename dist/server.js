"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config.env" });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const PORT = process.env.PORT || 3000;
const DB_STRING = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose_1.default
    .connect(DB_STRING)
    .then(() => console.log("DB Connected Successfully."));
app_1.default.listen(PORT, () => console.log(`listening on port ${PORT}`));
//# sourceMappingURL=server.js.map