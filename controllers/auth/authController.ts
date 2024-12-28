import { Request, Response, NextFunction } from "express";
import User from "../../models/userModel";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import { generateNewToken } from "../../utils/token";

/**
 * Register new user
 */

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
    const user = await User.create(userData);
    const token = generateNewToken(user?.id);

    res.status(201).json({
      status: "success",
      data: {
        token,
      },
    });
    next();
  }
);

export const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // Case 1 : No Email or Password
    if (!email || !password)
      return next(new AppError("Please enter email and Password", 400));
    const user = await User.findOne({ email }).select("+password");
    // Case 2 : No User found with these credentials
    if (!user) return next(new AppError("Wrong Credentials", 401));
    // Case 3 : Wrong password
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authenticated = await (user as any).checkPassword(
      password,
      user?.password
    );
    if (!authenticated) return next(new AppError("Wrong Credentials", 401));
    // Case 4 : Correct credentials
    const token = generateNewToken(user?.id);
    res.status(200).json({
      status: "success",
      token,
    });
  }
);
