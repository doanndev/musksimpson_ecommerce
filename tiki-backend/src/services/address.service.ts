import { MESSAGES } from '~/libs/constants/messages.constant';
import {
    AddressCreateInputSchema,
    type AddressCreateInputType,
    AddressResponseSchema,
    type AddressResponseType,
    AddressUpdateInputSchema,
    type AddressUpdateInputType,
} from '~/libs/schemas/address.schema';
import AddressRepository from '../repositories/address.repository';

class AddressService {
    async getAllByUser(user_id: string): Promise<AddressResponseType[]> {
        const addresses = await AddressRepository.findAllByUser(user_id);
        return addresses.map((addr) => AddressResponseSchema.parse(addr));
    }

    async getById(id: number): Promise<AddressResponseType> {
        const address = await AddressRepository.findById(id);
        if (!address) {
            throw new Error(MESSAGES.ADDRESS_NOT_FOUND);
        }
        return AddressResponseSchema.parse(address);
    }

    async create(data: AddressCreateInputType): Promise<AddressResponseType> {
        const parsedData = AddressCreateInputSchema.parse(data);
        const address = await AddressRepository.create(parsedData);
        return AddressResponseSchema.parse(address);
    }

    async update(id: number, data: AddressUpdateInputType): Promise<AddressResponseType> {
        const parsedData = AddressUpdateInputSchema.parse(data);
        const address = await AddressRepository.findById(id);
        if (!address) {
            throw new Error(MESSAGES.ADDRESS_NOT_FOUND);
        }
        const updatedAddress = await AddressRepository.update(id, parsedData);
        return AddressResponseSchema.parse(updatedAddress);
    }

    async delete(id: number): Promise<void> {
        const address = await AddressRepository.findById(id);
        if (!address) {
            throw new Error(MESSAGES.ADDRESS_NOT_FOUND);
        }
        await AddressRepository.delete(id);
    }
}

export default new AddressService();
