import { UserModel, IUser } from "../models/user.model";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;
  createUser(user: Partial<IUser>): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getAll(): Promise<IUser[]>;
  // pagination + search for admin user management
  getAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: IUser[]; total: number }>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}

export class UserMongoRepository implements IUserRepository {
  async getUserById(id: string): Promise<IUser | null> {
    const found = await UserModel.findOne({ _id: id });
    return found;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const found = await UserModel.findOne({ email });
    return found;
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
    const created = await UserModel.create(user);
    return created;
  }

  async getAll(): Promise<IUser[]> {
    const found = await UserModel.find();
    return found;
  }

  // paginated query with optional search across fullName and email
  async getAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: IUser[]; total: number }> {
    const query: any = {};

    // if search term provided, match against fullName or email (case insensitive)
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await UserModel.countDocuments(query);
    const data = await UserModel.find(query)
      .skip((page - 1) * limit) // skip records for previous pages
      .limit(limit); // only return the requested number of records

    return { data, total };
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    const updated = await UserModel.findByIdAndUpdate(id, user, { new: true });
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await UserModel.findByIdAndDelete(id);
    return !!deleted;
  }
}
