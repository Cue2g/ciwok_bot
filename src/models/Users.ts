import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IUsers {
    id: number;
    userName: string;
    name: string;
    createdAt?: Date;
    idGroup: number;
}
const usersSchema = new Schema<IUsers>({
    id: { type: Number, required: true },
    userName: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    idGroup: { type: Number, required: true }
});

const Users = mongoose.model('Users', usersSchema);

export default Users