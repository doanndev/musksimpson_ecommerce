import { normalizeProvince } from '.';

export interface FeeConfig {
  fee: number;
  days: number;
}

export enum ServiceType {
  STANDARD = 'Chuẩn',
  FAST = 'Nhanh',
}

export enum Region {
  HO_CHI_MINH = 1, // Hồ Chí Minh
  HA_NOI = 2, // Hà Nội
  DA_NANG = 3, // Đà Nẵng
  SOUTHERN = 4, // Các tỉnh Miền Nam
  CENTRAL = 5, // Các tỉnh Miền Trung
  NORTHERN = 6, // Các tỉnh Miền Bắc
}

// Enum for special provinces from Hanoi
export const specialProvincesFromHanoi = [
  'ninhthuan',
  'binhthuan',
  'lamdong',
  'binhphuoc',
  'tayninh',
  'binhduong',
  'dongnai',
  'baria-vungtau',
];

// Enum for special provinces from Ho Chi Minh City
export const specialProvincesFromHCM = ['hoabinh', 'hungyen', 'haiduong', 'hanam', 'thaibinh', 'namdinh', 'ninhbinh'];

export interface FeeTable {
  [ServiceType.STANDARD]: {
    sameProvinceMajor: FeeConfig; // Hà Nội, Tp.HCM
    sameProvinceMajorRural: FeeConfig;
    sameProvinceOther: FeeConfig; // Other provinces
    sameProvinceOtherRural: FeeConfig;
    sameRegion: FeeConfig;
    sameRegionRural: FeeConfig;
    special: FeeConfig; // Hà Nội ↔ Đà Nẵng, Tp.HCM ↔ Đà Nẵng
    specialRural: FeeConfig;
    differentRegion: FeeConfig;
    differentRegionRural: FeeConfig;
    differentRegionSpecial: FeeConfig; // Special provinces
    differentRegionSpecialRural: FeeConfig;
  };
  [ServiceType.FAST]: {
    sameProvinceMajor: FeeConfig;
    sameProvinceMajorRural: FeeConfig;
    sameProvinceOther: FeeConfig;
    sameProvinceOtherRural: FeeConfig;
    sameRegion: FeeConfig;
    sameRegionRural: FeeConfig;
    special: FeeConfig;
    specialRural: FeeConfig;
    differentRegion: FeeConfig;
    differentRegionRural: FeeConfig;
  };
}

export const defaultFeeTable: FeeTable = {
  [ServiceType.STANDARD]: {
    sameProvinceMajor: { fee: 22000, days: 0.25 }, // Hà Nội, Tp.HCM (3kg, 6h)
    sameProvinceMajorRural: { fee: 30000, days: 0.25 },
    sameProvinceOther: { fee: 16500, days: 0.5 }, // Other provinces (3kg, 12h)
    sameProvinceOtherRural: { fee: 30000, days: 0.5 },
    sameRegion: { fee: 30000, days: 1 }, // 0.5kg, 24h
    sameRegionRural: { fee: 35000, days: 1 },
    special: { fee: 30000, days: 3.5 }, // Hà Nội ↔ Đà Nẵng, Tp.HCM ↔ Đà Nẵng (0.5kg, 3-4 days)
    specialRural: { fee: 37000, days: 3.5 },
    differentRegion: { fee: 32000, days: 4 }, // 0.5kg, 3-5 days
    differentRegionRural: { fee: 40000, days: 4 },
    differentRegionSpecial: { fee: 30000, days: 4 }, // Special provinces (0.5kg, 3-5 days)
    differentRegionSpecialRural: { fee: 37000, days: 4 },
  },
  [ServiceType.FAST]: {
    sameProvinceMajor: { fee: 22000, days: 0.25 }, // Same as Standard for same province
    sameProvinceMajorRural: { fee: 30000, days: 0.25 },
    sameProvinceOther: { fee: 16500, days: 0.5 },
    sameProvinceOtherRural: { fee: 30000, days: 0.5 },
    sameRegion: { fee: 30000, days: 1 }, // 0.5kg, 24h
    sameRegionRural: { fee: 35000, days: 1 },
    special: { fee: 40000, days: 1 }, // Hà Nội ↔ Đà Nẵng, Tp.HCM ↔ Đà Nẵng (0.5kg, 24h)
    specialRural: { fee: 50000, days: 1 },
    differentRegion: { fee: 45000, days: 2 }, // 0.5kg, 48h
    differentRegionRural: { fee: 55000, days: 2 },
  },
};

interface Props {
  weight: number;
  serviceType: ServiceType;
  shopProvince: string;
  userProvince: string;
  userWard?: string; // For rural detection
  shopRegionId: Region;
  userRegionId: Region;
  feeTable?: FeeTable;
}

interface ShippingResult {
  shippingFee: number;
  estimatedDeliveryDays: number;
}

async function calculateShipping({
  weight,
  shopProvince,
  userProvince,
  userWard,
  shopRegionId,
  userRegionId,
  serviceType = ServiceType.STANDARD,
  feeTable = defaultFeeTable,
}: Props): Promise<ShippingResult> {
  console.log({
    weight,
    shopProvince,
    userProvince,
    userWard,
    shopRegionId,
    userRegionId,
    serviceType,
  });
  const normalizedShopProvince = normalizeProvince(shopProvince);
  const normalizedUserProvince = normalizeProvince(userProvince);
  const isRural = userWard?.toLowerCase().includes('xã') || false;

  // Check if the shipping is within the same province
  const isSameProvince = normalizedShopProvince === normalizedUserProvince;
  // Check if the shop is in a major city (Hanoi or Ho Chi Minh City)
  const isMajorCity = shopRegionId === Region.HA_NOI || shopRegionId === Region.HO_CHI_MINH;
  // Check if the route is special (Hanoi ↔ Da Nang, Ho Chi Minh City ↔ Da Nang, or Northern/Southern ↔ Da Nang)
  const isSpecialRoute =
    (shopRegionId === Region.HA_NOI && userRegionId === Region.DA_NANG) ||
    (shopRegionId === Region.HO_CHI_MINH && userRegionId === Region.DA_NANG) ||
    (shopRegionId === Region.DA_NANG && [Region.HA_NOI, Region.HO_CHI_MINH].includes(userRegionId)) ||
    (shopRegionId === Region.NORTHERN && userRegionId === Region.DA_NANG) ||
    (shopRegionId === Region.SOUTHERN && userRegionId === Region.DA_NANG) ||
    (shopRegionId === Region.DA_NANG && [Region.NORTHERN, Region.SOUTHERN].includes(userRegionId));

  // Check if the destination is a special province (specific provinces from Hanoi or Ho Chi Minh City)
  const isSpecialProvince =
    (shopRegionId === Region.HA_NOI && specialProvincesFromHanoi.includes(normalizedUserProvince)) ||
    (shopRegionId === Region.HO_CHI_MINH && specialProvincesFromHCM.includes(normalizedUserProvince)) ||
    ([Region.NORTHERN, Region.CENTRAL].includes(shopRegionId) &&
      ([Region.HO_CHI_MINH, ...specialProvincesFromHanoi] as string[]).includes(normalizedUserProvince)) ||
    ([Region.SOUTHERN, Region.CENTRAL].includes(shopRegionId) &&
      ([Region.HA_NOI, ...specialProvincesFromHCM] as string[]).includes(normalizedUserProvince));

  let shippingFee: number;
  let estimatedDeliveryDays: number;
  let weightThreshold: number = 0.5;
  let extraWeightFee: number = serviceType === ServiceType.STANDARD ? 5000 : 10000;

  // Adjust fees and delivery days based on location
  if (isSameProvince) {
    // Handle same-province shipping (e.g., within Hanoi, Ho Chi Minh City, or other provinces)
    if (isMajorCity) {
      // For major cities (Hanoi, Ho Chi Minh City), use 3kg threshold and lower extra weight fee
      weightThreshold = 3;
      extraWeightFee = 2500;
      shippingFee = isRural
        ? feeTable[serviceType].sameProvinceMajorRural.fee
        : feeTable[serviceType].sameProvinceMajor.fee;
      estimatedDeliveryDays = feeTable[serviceType].sameProvinceMajor.days;
    } else {
      // For other provinces, use 3kg threshold and lower extra weight fee
      weightThreshold = 3;
      extraWeightFee = 2500;
      shippingFee = isRural
        ? feeTable[serviceType].sameProvinceOtherRural.fee
        : feeTable[serviceType].sameProvinceOther.fee;
      estimatedDeliveryDays = feeTable[serviceType].sameProvinceOther.days;
    }
  } else if (
    // Handle same-region shipping (e.g., Northern ↔ Northern, Hanoi ↔ Northern, Ho Chi Minh City ↔ Southern)
    (shopRegionId === userRegionId && [Region.NORTHERN, Region.CENTRAL, Region.SOUTHERN].includes(shopRegionId)) ||
    (shopRegionId === Region.HA_NOI && userRegionId === Region.NORTHERN) ||
    (shopRegionId === Region.HO_CHI_MINH && userRegionId === Region.SOUTHERN) ||
    (shopRegionId === Region.NORTHERN && userRegionId === Region.HA_NOI) ||
    (shopRegionId === Region.SOUTHERN && userRegionId === Region.HO_CHI_MINH)
  ) {
    // Use lower extra weight fee for same-region routes
    extraWeightFee = 2500;
    shippingFee = isRural ? feeTable[serviceType].sameRegionRural.fee : feeTable[serviceType].sameRegion.fee;
    estimatedDeliveryDays = feeTable[serviceType].sameRegion.days;
  } else if (isSpecialRoute) {
    // Handle special routes (Hanoi ↔ Da Nang, Ho Chi Minh City ↔ Da Nang, or Northern/Southern ↔ Da Nang)
    shippingFee = isRural ? feeTable[serviceType].specialRural.fee : feeTable[serviceType].special.fee;
    estimatedDeliveryDays = feeTable[serviceType].special.days;
  } else {
    // Handle different-region shipping (e.g., Northern ↔ Central/Southern)
    if (serviceType === ServiceType.FAST) {
      // For FAST service, use different region fees
      shippingFee = isRural
        ? feeTable[serviceType].differentRegionRural.fee
        : feeTable[serviceType].differentRegion.fee;
      estimatedDeliveryDays = feeTable[serviceType].differentRegion.days;
    } else {
      // For STANDARD service, check if the destination is a special province
      shippingFee = isRural
        ? isSpecialProvince
          ? feeTable[serviceType].differentRegionSpecialRural.fee
          : feeTable[serviceType].differentRegionRural.fee
        : isSpecialProvince
          ? feeTable[serviceType].differentRegionSpecial.fee
          : feeTable[serviceType].differentRegion.fee;
      estimatedDeliveryDays = feeTable[serviceType].differentRegion.days;
    }
  }

  // Adjust fee based on weight
  const extraWeight = Math.max(0, weight - weightThreshold);
  const extraWeightIntervals = Math.ceil(extraWeight / 0.5); // Round to nearest 0.5kg
  shippingFee += extraWeightIntervals * extraWeightFee;

  // Adjust delivery days for rural/non-rural
  const isShopRural = shopProvince.toLowerCase().includes('xã'); // Check if shop is rural
  estimatedDeliveryDays += isShopRural ? 1 : 0.5;

  // Round up delivery days
  estimatedDeliveryDays = Math.ceil(estimatedDeliveryDays);

  return { shippingFee, estimatedDeliveryDays };
}

export { calculateShipping };
