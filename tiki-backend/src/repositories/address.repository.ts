import { PrismaClient, type addresses } from 'prisma/generated/client';
import { MESSAGES } from '~/libs/constants/messages.constant';
import type { AddressCreateInputType, AddressUpdateInputType } from '~/libs/schemas/address.schema';
import { fetchDistricts, fetchProvinces, fetchWards } from '~/libs/utils/ghnApi';

const prisma = new PrismaClient();

const AddressRepository = {
    addressGHN: async (address: any) => {
        const provinces = await fetchProvinces();
        const province = provinces.find((province: any) => province.ProvinceID === address.province_id);
        if (!province) throw new Error(MESSAGES.NOT_FOUND);

        const districts = await fetchDistricts(address.province_id as number);
        const district = districts.find((district: any) => district.DistrictID === address.district_id);
        if (!district) throw new Error(MESSAGES.NOT_FOUND);

        const wards = await fetchWards(address.district_id as number);
        const ward = wards.find((ward: any) => ward.WardCode === address.ward_code);
        if (!ward) throw new Error(MESSAGES.NOT_FOUND);

        return {
            province_id: address.province_id,
            province_name: province.ProvinceName,
            district_id: address.district_id,
            district_name: district.DistrictName,
            ward_code: address.ward_code,
            ward_name: ward.WardName,
            region_id: province.RegionID,
        };
    },

    findAllByUser: async (user_id: string): Promise<addresses[]> => {
        const user = await prisma.users.findUnique({
            where: { uuid: user_id, is_deleted: false },
        });
        if (!user) return [];
        return prisma.addresses.findMany({
            where: { user_id: user.id, is_deleted: false },
        });
    },

    findById: async (id: number): Promise<addresses | null> => {
        return prisma.addresses.findUnique({
            where: { id, is_deleted: false },
        });
    },

    create: async (address: AddressCreateInputType): Promise<addresses> => {
        const user = await prisma.users.findUnique({
            where: { uuid: address.user_id, is_deleted: false },
        });
        if (!user) throw new Error(MESSAGES.ACCOUNT_DOES_NOT_EXIST);

        if (address.is_default) {
            await prisma.addresses.updateMany({
                where: {
                    user_id: user.id,
                    is_default: true,
                },
                data: {
                    is_default: false,
                },
            });
        }

        const addressGHN = await AddressRepository.addressGHN(address);
        address.province_id = addressGHN.province_id;
        address.province_name = addressGHN.province_name;
        address.district_id = addressGHN.district_id;
        address.district_name = addressGHN.district_name;
        address.ward_code = addressGHN.ward_code;
        address.ward_name = addressGHN.ward_name;
        address.region_id = addressGHN.region_id;


        return prisma.addresses.create({
            data: {
                user_id: user.id,
                full_name: address.full_name,
                phone_number: address.phone_number,
                address: address.address,
                province_id: address.province_id,
                province_name: address.province_name,
                district_name: address.district_name,
                ward_name: address.ward_name,
                region_id: address.region_id,
                district_id: address.district_id,
                ward_code: address.ward_code,
                type_address: address.type_address,
                is_default: address.is_default || false,
            },
        });
    },

    update: async (id: number, data: AddressUpdateInputType): Promise<addresses> => {
        const address = await prisma.addresses.findUnique({
            where: { id, is_deleted: false },
        });
        if (!address) throw new Error(MESSAGES.ADDRESS_NOT_FOUND);

        if (data.is_default) {
            await prisma.addresses.updateMany({
                where: {
                    user_id: address.user_id,
                    is_default: true,
                },
                data: {
                    is_default: false,
                },
            });
        }

        const addressGHN = await AddressRepository.addressGHN(data);
        console.log({ data, addressGHN });
        data.province_id = addressGHN.province_id;
        data.province_name = addressGHN.province_name;
        data.district_id = addressGHN.district_id;
        data.district_name = addressGHN.district_name;
        data.ward_code = addressGHN.ward_code;
        data.ward_name = addressGHN.ward_name;
        data.region_id = addressGHN.region_id;

        return prisma.addresses.update({
            where: { id },
            data: {
                full_name: data.full_name,
                phone_number: data.phone_number,
                address: data.address,
                region_id: data.region_id,
                province_name: data.province_name,
                district_name: data.district_name,
                ward_name: data.ward_name,
                province_id: data.province_id,
                district_id: data.district_id,
                ward_code: data.ward_code,
                type_address: data.type_address,
                is_default: data.is_default || false,
                updated_at: new Date(),
            },
        });
    },

    delete: async (id: number): Promise<void> => {
        const address = await prisma.addresses.findUnique({
            where: { id, is_deleted: false },
        });
        if (!address) throw new Error(MESSAGES.ADDRESS_NOT_FOUND);

        await prisma.addresses.update({
            where: { id },
            data: {
                is_deleted: true,
                updated_at: new Date(),
            },
        });
    },
};

export default AddressRepository;
