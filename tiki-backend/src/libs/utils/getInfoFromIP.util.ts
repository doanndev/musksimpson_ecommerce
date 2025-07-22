import axios from 'axios';
import redisClient from '~/configs/redis.config';
import { normalizeProvince } from '.';
import { fetchProvinces } from './ghnApi';

// Cache key prefix and expiration time (1 hour in seconds)
const CACHE_PREFIX = 'user:location:';
const CACHE_TTL = 3600; // 1 hour

export const getInfoFromIP = async (
  ip: string = ''
): Promise<{
  lat: string;
  lon: string;
  region: string;
  provinceId: number;
  regionId: number;
  provinceName: string;
  address: any;
}> => {
  try {
    // Generate cache key based on IP (use provided IP or fallback to empty string)
    const cacheKey = `${CACHE_PREFIX}${ip || 'default'}`;

    // Check if location data exists in Redis cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for IP: ${ip}`);
      return JSON.parse(cachedData);
    }

    console.log(`Cache miss for IP: ${ip}, fetching from API`);

    // Fetch IP-based location data
    const { data: ipData } = await axios.get(`https://ipinfo.io/json`);

    const [lat, lon] = ipData.loc.split(',');
    const region = normalizeProvince(ipData.region);

    // Fetch detailed address data
    const { data: nominatimData } = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
    );

    // Fetch province data
    const provinces = await fetchProvinces();
    const province = provinces.find((province: any) => province.NameExtension.includes(region));

    if (!province) {
      throw new Error('Province not found');
    }

    const provinceId = province.ProvinceID;
    const provinceName = province.ProvinceName;
    const regionId = province.RegionID;

    // Prepare location data
    const locationData = {
      lat,
      lon,
      region,
      provinceId,
      regionId,
      provinceName,
      address: nominatimData.address,
    };

    // Store in Redis with TTL
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(locationData));

    return locationData;
  } catch (error: any) {
    console.error('Error in getInfoFromIP:', error.message);
    throw new Error(error.message);
  }
};
