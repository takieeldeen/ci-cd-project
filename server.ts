import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;
const DB_STRING = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB_STRING)
  .then(() => console.log("DB Connected Successfully."));
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
