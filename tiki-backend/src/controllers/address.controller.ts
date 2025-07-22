import type { Request, Response } from 'express';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { AuthRequest } from '~/libs/types/common.types';
import { response } from '~/libs/utils/response.util';
import AddressService from '~/services/address.service';

class AddressController {
    async getAllByUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const user_id = req.user?.userId;
            if (!user_id) {
                throw new Error(MESSAGES.NOT_LOGGED_IN);
            }
            const addresses = await AddressService.getAllByUser(user_id);
            response.success(res, addresses, MESSAGES.ADDRESSES_RETRIEVED);
        } catch (error: any) {
            response.error(res, error);
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new Error(MESSAGES.INVALID_ADDRESS_ID);
            }
            const address = await AddressService.getById(id);
            response.success(res, address, MESSAGES.ADDRESS_RETRIEVED);
        } catch (error: any) {
            response.notFound(res, error);
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        console.log('====================================');
        console.log("req dataa", req.body);
        console.log('====================================');
        try {
            const address = await AddressService.create(req.body);
            response.success(res, address, MESSAGES.ADDRESS_CREATED);
        } catch (error: any) {
            response.badRequest(res, error);
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new Error(MESSAGES.INVALID_ADDRESS_ID);
            }
            const address = await AddressService.update(id, req.body);
            response.success(res, address, MESSAGES.ADDRESS_UPDATED);
        } catch (error: any) {
            response.notFound(res, error);
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new Error(MESSAGES.INVALID_ADDRESS_ID);
            }
            await AddressService.delete(id);
            response.success(res, MESSAGES.ADDRESS_DELETED);
        } catch (error: any) {
            response.notFound(res, error);
        }
    }
}

export default new AddressController();
