import { BrandMongoRepository } from "../repositories/brand.repository";
import { CreateBrandDTO, UpdateBrandDTO } from "../dtos/brand.dto";
import { IBrand } from "../models/brand.model";
import { HttpException } from "../exceptions/http-exception";

const brandRepository = new BrandMongoRepository();

export class BrandService {
  // get all brands for the public homepage
  async getAllBrands(): Promise<IBrand[]> {
    const brands = await brandRepository.getAll();
    return brands;
  }

  async createBrand(data: CreateBrandDTO, logoUrl?: string): Promise<IBrand> {
    // check if brand with same name already exists
    const existing = await brandRepository.getBrandByName(data.name);
    if (existing) {
      throw new HttpException(400, `Brand "${data.name}" already exists`);
    }

    const brand = await brandRepository.createBrand({
      ...data,
      logoUrl, // set from multer upload, undefined if no image uploaded
    });
    return brand;
  }

  async updateBrand(
    id: string,
    data: UpdateBrandDTO,
    logoUrl?: string,
  ): Promise<IBrand> {
    const existing = await brandRepository.getBrandById(id);
    if (!existing) {
      throw new HttpException(404, "Brand not found");
    }

    // only update logoUrl if a new image was uploaded
    const updateData = logoUrl ? { ...data, logoUrl } : data;

    const updated = await brandRepository.update(id, updateData);
    return updated!;
  }

  async deleteBrand(id: string): Promise<boolean> {
    const existing = await brandRepository.getBrandById(id);
    if (!existing) {
      throw new HttpException(404, "Brand not found");
    }
    return await brandRepository.delete(id);
  }

  // get paginated brands with optional search for admin dashboard
  async getAllBrandsPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: IBrand[]; total: number }> {
    return await brandRepository.getAllPaginated(page, limit, search);
  }
}
