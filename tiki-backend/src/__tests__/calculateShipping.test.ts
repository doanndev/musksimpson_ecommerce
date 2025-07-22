import { Region, ServiceType } from '~/libs/types/product.types';
import { calculateShipping, defaultFeeTable } from '~/libs/utils/calculateShipping.util';

jest.mock('~/libs/types/product.types', () => ({
  Region: {
    HO_CHI_MINH: 1,
    HA_NOI: 2,
    DA_NANG: 3,
    MIEN_NAM: 4,
    MIEN_TRUNG: 5,
    MIEN_BAC: 6,
  },
  ServiceType: {
    STANDARD: 'Chuẩn',
    FAST: 'Nhanh',
  },
}));

describe('calculateShipping', () => {
  const baseProps = {
    weight: 0.5,
    shopProvince: 'Hà Nội',
    userProvince: 'Hà Nội',
    shopRegionId: Region.HA_NOI,
    userRegionId: Region.HA_NOI,
    serviceType: ServiceType.STANDARD,
    feeTable: defaultFeeTable,
  };

  it('should calculate shipping for same province (STANDARD)', async () => {
    const result = await calculateShipping({
      ...baseProps,
      weight: 0.5,
      shopProvince: 'Hà Nội',
      userProvince: 'Hà Nội',
      serviceType: ServiceType.STANDARD,
    });

    expect(result).toEqual({
      shippingFee: 20000,
      estimatedDeliveryDays: 1,
    });
  });

  it('should calculate shipping for same province (FAST)', async () => {
    const result = await calculateShipping({
      ...baseProps,
      weight: 0.5,
      shopProvince: 'Hà Nội',
      userProvince: 'Hà Nội',
      serviceType: ServiceType.FAST,
    });

    expect(result).toEqual({
      shippingFee: 30000,
      estimatedDeliveryDays: 1, // ceil(0.5)
    });
  });

  it('should calculate shipping for same region, major city (STANDARD)', async () => {
    const result = await calculateShipping({
      ...baseProps,
      weight: 0.5,
      shopProvince: 'Hà Nội',
      userProvince: 'Hà Nội',
      shopRegionId: Region.HA_NOI,
      userRegionId: Region.HA_NOI,
      serviceType: ServiceType.STANDARD,
    });

    expect(result).toEqual({
      shippingFee: 20000, // sameProvince takes precedence
      estimatedDeliveryDays: 1,
    });
  });

  it('should calculate shipping for same region, non-major city (STANDARD)', async () => {
    const result = await calculateShipping({
      ...baseProps,
      weight: 0.5,
      shopProvince: 'Bắc Ninh',
      userProvince: 'Hải Phòng',
      shopRegionId: Region.NORTHERN,
      userRegionId: Region.NORTHERN,
      serviceType: ServiceType.STANDARD,
    });

    expect(result).toEqual({
      shippingFee: 35000,
      estimatedDeliveryDays: 3,
    });
  });

  it('should calculate shipping for different regions, major city destination (FAST)', async () => {
    const result = await calculateShipping({
      ...baseProps,
      weight: 0.5,
      shopProvince: 'Hà Nội',
      userProvince: 'Tp. Hồ Chí Minh',
      shopRegionId: Region.HA_NOI,
      userRegionId: Region.HO_CHI_MINH,
      serviceType: ServiceType.FAST,
    });

    expect(result).toEqual({
      shippingFee: 60000,
      estimatedDeliveryDays: 3,
    });
  });

  it('should calculate shipping for different regions, non-major city destination (FAST)', async () => {
    const result = await calculateShipping({
      ...baseProps,
      weight: 0.5,
      shopProvince: 'Hà Nội',
      userProvince: 'Cần Thơ',
      shopRegionId: Region.HA_NOI,
      userRegionId: Region.SOUTHERN,
      serviceType: ServiceType.FAST,
    });

    expect(result).toEqual({
      shippingFee: 70000,
      estimatedDeliveryDays: 4,
    });
  });

  it('should calculate shipping with extra weight (1.5kg, STANDARD)', async () => {
    const result = await calculateShipping({
      ...baseProps,
      weight: 1.5,
      shopProvince: 'Hà Nội',
      userProvince: 'Hà Nội',
      serviceType: ServiceType.STANDARD,
    });

    expect(result).toEqual({
      shippingFee: 20000 + 2 * 10000,
      estimatedDeliveryDays: 1,
    });
  });

  it('should calculate shipping with custom fee table', async () => {
    const customFeeTable = {
      [ServiceType.STANDARD]: {
        sameProvince: { fee: 15000, days: 1 },
        sameRegionMajor: { fee: 20000, days: 2 },
        sameRegionNonMajor: { fee: 30000, days: 3 },
        differentRegionMajor: { fee: 35000, days: 4 },
        differentRegionNonMajor: { fee: 45000, days: 5 },
      },
      [ServiceType.FAST]: {
        sameProvince: { fee: 25000, days: 0.5 },
        sameRegionMajor: { fee: 30000, days: 1 },
        sameRegionNonMajor: { fee: 40000, days: 2 },
        differentRegionMajor: { fee: 50000, days: 3 },
        differentRegionNonMajor: { fee: 60000, days: 4 },
      },
    };

    const result = await calculateShipping({
      ...baseProps,
      weight: 0.5,
      shopProvince: 'Hà Nội',
      userProvince: 'Tp. Hồ Chí Minh',
      shopRegionId: Region.HA_NOI,
      userRegionId: Region.HO_CHI_MINH,
      serviceType: ServiceType.FAST,
      feeTable: customFeeTable,
    });

    expect(result).toEqual({
      shippingFee: 50000,
      estimatedDeliveryDays: 3,
    });
  });

  it('should use default MIEN_BAC when region IDs are not provided', async () => {
    const result = await calculateShipping({
      ...baseProps,
      weight: 0.5,
      shopProvince: 'Bắc Ninh',
      userProvince: 'Hải Phòng',
      shopRegionId: undefined,
      userRegionId: undefined,
      serviceType: ServiceType.STANDARD,
    });

    expect(result).toEqual({
      shippingFee: 35000,
      estimatedDeliveryDays: 3,
    });
  });

  it('should handle province name variations (accents, spaces)', async () => {
    const result = await calculateShipping({
      ...baseProps,
      weight: 0.5,
      shopProvince: 'Hà Nội',
      userProvince: 'Ha Noi',
      serviceType: ServiceType.STANDARD,
    });

    expect(result).toEqual({
      shippingFee: 20000,
      estimatedDeliveryDays: 1,
    });
  });
});
