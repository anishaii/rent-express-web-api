import { BrandModel, IBrand } from "../models/brand.model";

export interface IBrandRepository {
  createBrand(brand: Partial<IBrand>): Promise<IBrand>;
  getBrandById(id: string): Promise<IBrand | null>;
  getBrandByName(name: string): Promise<IBrand | null>;
  getAll(): Promise<IBrand[]>;
  update(id: string, brand: Partial<IBrand>): Promise<IBrand | null>;
  delete(id: string): Promise<boolean>;
}

export class BrandMongoRepository implements IBrandRepository {
  async createBrand(brand: Partial<IBrand>): Promise<IBrand> {
    const created = await BrandModel.create(brand);
    return created;
  }

  async getBrandById(id: string): Promise<IBrand | null> {
    const found = await BrandModel.findOne({ _id: id });
    return found;
  }

  // used to check for duplicate brand names before creating
  async getBrandByName(name: string): Promise<IBrand | null> {
    const found = await BrandModel.findOne({ name });
    return found;
  }

  async getAll(): Promise<IBrand[]> {
    const found = await BrandModel.find();
    return found;
  }

  async update(id: string, brand: Partial<IBrand>): Promise<IBrand | null> {
    const updated = await BrandModel.findByIdAndUpdate(id, brand, {
      new: true,
    });
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await BrandModel.findByIdAndDelete(id);
    return !!deleted;
  }
}
