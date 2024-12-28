import { sign } from "jsonwebtoken";

export const generateNewToken = (id: unknown) => {
  const token = sign({ id: id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_DURATION,
  });
  return token;
};
