import { ObjectId } from "mongodb";

export type Issue = {
  _id: ObjectId;
  title: string;
  description: string;
};
