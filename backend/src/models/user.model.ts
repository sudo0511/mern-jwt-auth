import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: string | number;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Pick<
    UserDocument,
    "_id" | "email" | "verified" | "createdAt" | "updatedAt" | "__v"
  >;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true, // this will let mongoose automatically add/manage createAt and updatedAt keys
  }
);

//Info: pre is like a hook provided by mongoose which will automatically run and is
//used to perform actions before certain events on a document or model like before document is saved hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

userSchema.methods.omitPassword = function () {
  const user = this.toObject(); //buit-in mongoose method which converts user docuemnt to JS object
  delete user.password;
  return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
