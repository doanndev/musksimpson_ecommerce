import type { Request, Response } from 'express';
import { MESSAGES } from '~/libs/constants/messages.constant';
import { response } from '~/libs/utils/response.util';
import ProductService from '~/services/product.service';

class ProductController {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const { items, meta } = await ProductService.getAll(req.query);
            response.paginate(res, items, meta, MESSAGES.PRODUCTS_RETRIEVED);
        } catch (error: any) {
            console.log(error);
            response.error(res, error);
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const product = await ProductService.getById(req.params.uuid);
            response.success(res, product, MESSAGES.PRODUCT_RETRIEVED);
        } catch (error: any) {
            console.log(error);
            response.notFound(res, error);
        }
    }
    async calculateShippingFee(req: Request, res: Response): Promise<void> {
        try {
            const { uuids } = req.body;
            if (!Array.isArray(uuids) || uuids.length === 0) {
                response.badRequest(res, 'Danh sách UUID không hợp lệ');
            }
            const newuuids = uuids.map(String);
            const products = await ProductService.calculateShippingFee(newuuids);
            response.success(res, products, MESSAGES.PRODUCT_RETRIEVED);
        } catch (error: any) {
            console.log(error);
            response.notFound(res, error);
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const product = await ProductService.create(req.body);
            response.success(res, product, MESSAGES.PRODUCT_CREATED);
        } catch (error: any) {
            response.badRequest(res, error);
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const product = await ProductService.update(req.params.uuid, req.body);
            response.success(res, product, MESSAGES.PRODUCT_UPDATED);
        } catch (error: any) {
            response.notFound(res, error);
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const product = await ProductService.delete(req.params.uuid);
            response.success(res, product, MESSAGES.PRODUCT_DELETED);
        } catch (error: any) {
            response.notFound(res, error);
        }
    }
}

export default new ProductController();
