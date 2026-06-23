import { z } from "zod";
import { Request, Response } from "express";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { CreateBrandDTO, UpdateBrandDTO } from "../../dtos/brand.dto";
import { BrandService } from "../../services/brand.service";

const brandService = new BrandService();

export class BrandController {
  // public - anyone can view all brands
  async getAllBrands(req: Request, res: Response) {
    try {
      const brands = await brandService.getAllBrands();
      return ApiResponseHelper.success(
        res,
        brands,
        "Brands fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // admin only - create brand with optional logo upload
  async createBrand(req: Request, res: Response) {
    try {
      const brandData = CreateBrandDTO.safeParse(req.body);
      if (!brandData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(brandData.error),
          400,
        );
      }

      // get logo filename from multer if image was uploaded
      const logoUrl = req.file?.filename
        ? "/uploads/" + req.file.filename
        : undefined;

      const brand = await brandService.createBrand(brandData.data, logoUrl);
      return ApiResponseHelper.success(
        res,
        brand,
        "Brand created successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // admin only - update brand name or logo
  async updateBrand(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const brandData = UpdateBrandDTO.safeParse(req.body);
      if (!brandData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(brandData.error),
          400,
        );
      }

      const logoUrl = req.file?.filename
        ? "/uploads/" + req.file.filename
        : undefined;

      const brand = await brandService.updateBrand(id, brandData.data, logoUrl);
      return ApiResponseHelper.success(
        res,
        brand,
        "Brand updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // admin only - delete brand by id
  async deleteBrand(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      await brandService.deleteBrand(id);
      return ApiResponseHelper.success(res, null, "Brand deleted successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
