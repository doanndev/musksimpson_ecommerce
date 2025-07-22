import axios from 'axios';

const GHN_TOKEN = 'c43d29e2-4407-11eb-b7e7-eeaa791b204b';

export async function fetchProvinces() {
  try {
    const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
      headers: {
        Token: GHN_TOKEN,
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching provinces from GHN:', error.message);
    return [];
  }
}

export async function fetchDistricts(provinceId: number) {
  try {
    const response = await axios.post(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
      { province_id: provinceId },
      {
        headers: {
          Token: GHN_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching districts for province ${provinceId}:`, error.message);
    return [];
  }
}

export async function fetchWards(districtId: number) {
  try {
    const response = await axios.post(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
      { district_id: districtId },
      {
        headers: {
          Token: GHN_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching wards for district ${districtId}:`, error.message);
    return [];
  }
}
