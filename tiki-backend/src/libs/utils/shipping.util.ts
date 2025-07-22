import dayjs from 'dayjs';
import redisClient from '~/configs/redis.config';
import type { AddressResponseType } from '~/libs/schemas/address.schema';
import { ServiceType, calculateShipping } from '~/libs/utils/calculateShipping.util';
import { getInfoFromIP } from '~/libs/utils/getInfoFromIP.util';
import { getRequestIP } from '~/libs/utils/requestContext.util';
import userService from '~/services/user.service';

// Cache key prefix and TTL (1 hour)
const SHIPPING_CACHE_PREFIX = 'shipping:fee:';
const SHIPPING_CACHE_TTL = 3600; // 1 hour

interface ShippingParams {
  product: any;
  userId?: string;
}

interface ShippingResult {
  fee: number | null;
  estimated_delivery_date: string | null;
}

export const calculateShippingFeeForProduct = async ({ product, userId }: ShippingParams): Promise<ShippingResult> => {
  const cacheKey = `${SHIPPING_CACHE_PREFIX}${product.shop?.address?.province_name}:${product.weight}:${userId || getRequestIP()}`;

  // Check cache
  const cachedResult = await redisClient.get(cacheKey);
  if (cachedResult) {
    return JSON.parse(cachedResult);
  }

  let fee: number | null = null;
  let estimated_delivery_date: string | null = null;

  if (product.shop?.address?.province_name && product.shop?.address?.region_id) {
    let userProvince: string | undefined;
    let userWard: string | undefined;
    let userRegionId: number | undefined;

    // Try to get user's default address
    if (userId) {
      const user = await userService.getUserById(userId);
      const defaultAddress = user?.addresses?.find((addr: AddressResponseType) => addr.is_default);
      if (defaultAddress) {
        userProvince = defaultAddress.province_name || undefined;
        userWard = defaultAddress.ward_name || undefined;
        userRegionId = defaultAddress.region_id || undefined;
      }
    }

    // Fallback to IP-based location if no default address
    if (!userProvince || !userWard || !userRegionId) {
      const userIP = getRequestIP();
      const userLocation = await getInfoFromIP(userIP);
      userProvince = userLocation.provinceName;
      userWard = userLocation.address?.quarter;
      userRegionId = userLocation.regionId;
    }

    const { shippingFee, estimatedDeliveryDays } = await calculateShipping({
      weight: product.weight ?? 0,
      shopProvince: product.shop.address.province_name,
      userProvince,
      userWard,
      shopRegionId: product.shop.address.region_id,
      userRegionId,
      serviceType: ServiceType.STANDARD,
    });

    fee = shippingFee;
    estimated_delivery_date = dayjs().add(estimatedDeliveryDays, 'day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  }

  // Cache the result
  const result = { fee, estimated_delivery_date };
  await redisClient.setEx(cacheKey, SHIPPING_CACHE_TTL, JSON.stringify(result));

  return result;
};
