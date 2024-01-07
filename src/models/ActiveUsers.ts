import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IActiveUsers {
    idUser: number;
    idGroup: number;
    optionName?: string | null;
    optionValue?: number | null;
    activeUser: boolean;
    createdAt: Date;
    valueGroup: number;
}

const activeUsersSchema = new Schema<IActiveUsers>({
    idUser: { type: Number, required: true },
    idGroup: { type: Number, required: true },
    optionName: { type: String, default: null },
    optionValue: { type: Number, default: null },
    activeUser: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    valueGroup: { type: Number,default: null }
});



const ActiveUsers = mongoose.model('ActiveUsers', activeUsersSchema);


export default ActiveUsers