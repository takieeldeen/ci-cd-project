import { CallbackWithoutResultAndOptionalError, Schema, model } from "mongoose";
import { isEmail } from "validator";
import { hash, compare } from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter the user name"],
    minLength: [3, "Username can't be less than 3 letters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter the user email"],
    validate: {
      validator: isEmail,
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

userSchema.pre(
  "save",
  async function (next: CallbackWithoutResultAndOptionalError) {
    // Run the encryption function only if the user is modifying the password
    if (!this.isModified("password")) return;
    //   hash the password with 2^12 iterations
    this.password = await hash(this.password, 12);
    // Remove the confirmation password
    this.confirmPassword = undefined;
    next();
  }
);

userSchema.methods.checkPassword = async (
  userPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(userPassword, hashedPassword);
};

const User = model("users", userSchema);
export default User;
