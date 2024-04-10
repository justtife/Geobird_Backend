import { Schema, model } from "mongoose";
import { UserRole } from "../utils";
import { RoleInterface } from "../utils";
import { v4 as uuid } from "uuid"
import { UserModel } from ".";
const RoleSchema = new Schema<RoleInterface>(
    {
        userID: {
            type: String,
            ref: UserModel
        },
        roleID: {
            type: String,
            unique: true,
            index: true,
            default: uuid(),
        },
        locked: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            default: "user",
            enum: Object.values(UserRole)
        }
    },
)
RoleSchema.index({ RoleID: 1 }, { unique: true });
export default model<RoleInterface>("Role", RoleSchema);