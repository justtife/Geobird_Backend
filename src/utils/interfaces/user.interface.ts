import { Document } from "mongoose";
type UserDocument = Document & {
    firstname: string;
    lastname: string;
    username?: string;
    userID: string;
    email: string;
    password: string;
    profilePic?: string;
    googleID?: string;
    sex?: "male" | "female";
    nationality?: string;
    passwordResetToken?: string;
    passwordResetExpiry?: string;
    isValidPassword(password: string): Promise<Error | boolean>;
    sendResetPasswordMail(): Promise<Error | string>;
    validateResetPasswordToken(
        resetToken: string,
        newPassword: string
    ): Promise<Error | void>;
    makeRemoveAdmin(role: string): Promise<Error | void>;
};
export default UserDocument;