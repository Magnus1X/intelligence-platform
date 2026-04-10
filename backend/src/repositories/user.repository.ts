import { UserModel } from "../models/User.model";
import { IUser } from "../interfaces";

export class UserRepository {
  async create(data: Partial<IUser>): Promise<IUser> {
    return UserModel.create(data);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).select("-password");
  }

  async findAll(): Promise<IUser[]> {
    return UserModel.find().select("-password");
  }

  async deleteById(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
}
