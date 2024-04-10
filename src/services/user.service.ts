import { UserModel, RoleModel } from "../models";
import mongoose from "mongoose";
import { UserInterface, Error } from "../utils";
const db = mongoose.connection
export default class User {
    static async createUser(userDetail: any): Promise<UserInterface | Error | null> {
        const { firstname, lastname, username, email, password, role } = userDetail
        const user = await User.getUserByEmail(email);
        if (user) {
            throw new Error.Duplicate(
                "User with email exist, please signup with a new email"
            );
        }
        let userCreated: UserInterface | null = null
        const session = await db.startSession();
        // Use the session with transactions
        await session.withTransaction(async () => {
            let newUser = new UserModel();
            newUser.firstname = firstname;
            newUser.lastname = lastname;
            newUser.username = username;
            newUser.email = email;
            newUser.password = password;
            const mainUser = await newUser.save({ session });
            let userRole = new RoleModel();
            userRole.userID = mainUser.userID;
            if (role) userRole.role = role
            await userRole.save({ session });
            await session.commitTransaction();
            userCreated = mainUser
            // Commit the transaction
        }).catch(async (error) => {
            await session.abortTransaction();
            return new Error.Server(`An error occured with the server, please try again later. ${error}`)
        }).finally(() => {
            session.endSession();
        });
        return userCreated;
    }
    static async getUserByEmail(email: string): Promise<UserInterface | null | Error> {
        const user = await UserModel.findOne({ email }).select("firstname lastname userID accountStatus")
        return user;
    }
    static async getUserByID(id: string): Promise<UserInterface | null> {
        const user = await UserModel.findById(id).populate('roles', 'role locked', RoleModel);
        return user;
    }
    static async loginUser(userData: string): Promise<UserInterface | null> {
        const loginUser = await UserModel.findOne({
            $or: [
                { email: userData },
                { lastname: userData }
            ]
        })
            .populate('roles', '-userID -locked -createdAt -updatedAt', RoleModel, // Exclude specified fields
            )
            .select('-createdAt -updatedAt'); // Exclude specified fields from the main UserModel

        return loginUser;

    }
    static async getAllUser(): Promise<UserInterface[] | any> {
        const users = await UserModel.find({}).populate("roles", "role locked", RoleModel)
        if (!users) {
            throw new Error.NotFound("No user was found")
        }
        return users
    }
    // static async getAllAdmin(): Promise<UserModel[] | null> {
    //     const admins = await UserModel.findAll({
    //         include: [{
    //             model: RoleModel,
    //             as: 'user_role',
    //             where: { role: { [Op.not]: "user" } } // Specify the condition for the role ('admin' in this case)
    //         }]
    //     })
    //     if (!admins) {
    //         throw new Error.NotFound("No admin was found")
    //     }
    //     return admins
    // }
    // static async updateUser(body: any, userID: string): Promise<UserModel | Error> {
    //     const sequelize = DBConnection.db
    //     const { firstname, lastname, username, email, role } = body;
    //     const t = await sequelize.transaction();
    //     const user = await User.getUserByID(userID);
    //     try {
    //         user!.firstname = firstname;
    //         user!.lastname = lastname;
    //         user!.username = username;
    //         user!.email = email;
    //         const mainUser = await user!.save({ transaction: t });
    //         if (role) {
    //             const userRole = await RoleService.checkRoleByUser(userID)
    //             userRole!.role = role
    //             await userRole!.save({ transaction: t });
    //         }
    //         await t.commit();
    //         return mainUser;
    //     }
    //     catch (error) {
    //         if (t) {
    //             t.rollback();
    //         }
    //         throw new Error.Server(`Database Error: ${error}`)
    //     }
    // }
}