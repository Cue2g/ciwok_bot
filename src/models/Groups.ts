import mongoose from "mongoose";

export interface IGroups {
  id: number;
  title: string;
  value: number;
  createdAt: Date;
  type: string;
}
const Schema = mongoose.Schema;

const GroupSchema = new Schema<IGroups>({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  type: { type: String, required: true }
});

const Group = mongoose.model('Groups', GroupSchema);

module.exports = Group;