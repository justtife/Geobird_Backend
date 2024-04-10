type RoleDocument = Document & {
    roleID: string;
    userID:string;
    locked: boolean;
    role: string;
};
export default RoleDocument;