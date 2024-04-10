import { RoleModel, } from "../models";
import { RoleInterface, Error } from "../utils"
export default class User {
    static async checkRole(roleID: string): Promise<RoleInterface | Error> {
        const role = await RoleModel.findById(roleID)
        if (!role) {
            throw new Error.NotFound("User does not exist")
        }
        return role;
    }
    static async checkRoleByUser(userID: string): Promise<RoleInterface | null> {
        const role = await RoleModel.findOne({userID})
        if (!role) {
            throw new Error.NotFound("User does not exist")
        }
        return role;
    }
}