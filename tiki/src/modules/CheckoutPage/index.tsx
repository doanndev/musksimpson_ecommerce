import { ROUTES } from '@/lib/routes';
import { formatPriceToVnd } from '@/lib/utils';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './style.scss';

interface CheckoutPageProps {}

interface InfoOrder {
  uuid: string;
  fullName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  typeAddress: string;
}

interface AddressState {
  provinces: any;
  districts: any;
  wards: any;
}

function CheckoutPage(props: CheckoutPageProps) {
  const { userCurrent, userProductsOrder, isLoading } = {} as any;
  const router = useRouter();

  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState<boolean>(false);
  const [showPaypal, setShowPaypal] = useState<boolean>(false);
  const [infoOrder, setInfoOrder] = useState<InfoOrder>({
    uuid: '',
    fullName: '',
    phoneNumber: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    typeAddress: 'Nhà riêng',
  });
  const [address, setAddress] = useState<AddressState>({
    provinces: [],
    districts: [],
    wards: [],
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await axios.get('https://vnprovinces.pythonanywhere.com/api/provinces/?basic=true&limit=100');
      setAddress((prev: any) => ({ ...prev, provinces: res.data.results }));
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!userProductsOrder.length) router.push(ROUTES.CART);
  }, [userProductsOrder, router]);

  const handleFetchGetDistricts = async (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    const res = await axios.get(
      `https://vnprovinces.pythonanywhere.com/api/districts/?province_id=${value}&basic=true&limit=100`
    );
    setAddress((prev: any) => ({ ...prev, districts: res.data.results }));
    setInfoOrder((prev: any) => ({ ...prev, province: name }));
  };

  const handleFetchGetWards = async (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    const res = await axios.get(
      `https://vnprovinces.pythonanywhere.com/api/wards/?district_id=${value}&basic=true&limit=100`
    );
    setAddress((prev: any) => ({ ...prev, wards: res.data.results }));
    setInfoOrder((prev: any) => ({ ...prev, district: name }));
  };

  const handleChangeWard = (e: ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.options[e.target.selectedIndex].text;
    setInfoOrder((prev: any) => ({ ...prev, ward: name }));
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setInfoOrder((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const totalPrice = useMemo(() => {
    return 0;
  }, [userProductsOrder]);

  const handleAddInfo = async () => {};

  const handleCheckout = async () => {
    const order = {
      id: uuidv4(),
      products: userProductsOrder,
      infoOrder,
      total: totalPrice,
      createdAt: moment().format(),
      updatedAt: moment().format(),
    };

    console.log(infoOrder);
    console.log(userProductsOrder);

    setIsCheckoutSuccess(true);
  };

  const handleChoosePay = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('🚀 ~ handleChoosePay ~ value:', value);
    setShowPaypal(value === 'paypal-money');
  };

  return (
    <div className='checkout container'>
      <div className='checkout__left'>
        {isCheckoutSuccess && (
          <div className='alert-success'>
            <img src='/images/check.png' alt='' />
            <p>Đơn hàng đặt hàng thành công</p>
          </div>
        )}
        <div className='checkout__form checkout--bg-white'>
          <h2 className='checkout__form--heading'>Địa chỉ giao hàng</h2>
          <div className='checkout__form-container'>
            <div className='checkout__form-group'>
              <label htmlFor='' className='checkout__form-label'>
                Họ và tên
              </label>
              <input type='text' name='fullName' value={infoOrder.fullName} onChange={handleChangeInput} />
            </div>
            <div className='checkout__form-group'>
              <label htmlFor='' className='checkout__form-label'>
                Điện thoại di động
              </label>
              <input type='text' name='phoneNumber' value={infoOrder.phoneNumber} onChange={handleChangeInput} />
            </div>
            <div className='checkout__form-group'>
              <label htmlFor='' className='checkout__form-label'>
                Tỉnh/Thành phố
              </label>
              <select name='province' onChange={handleFetchGetDistricts}>
                <option value='' disabled selected={!infoOrder.province} hidden>
                  Chọn Tỉnh/Thành phố
                </option>
                {address.provinces.map(({ id, full_name }: any) => (
                  <option key={id} value={id} selected={infoOrder.province.toLowerCase() === full_name.toLowerCase()}>
                    {full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className='checkout__form-group'>
              <label htmlFor='' className='checkout__form-label'>
                Quận/Huyện
              </label>
              <select name='district' onChange={handleFetchGetWards}>
                <option value='' disabled selected={!infoOrder.district} hidden>
                  Chọn Quận/Huyện
                </option>
                {address.districts.map(({ id, full_name }: any) => (
                  <option key={id} value={id} selected={infoOrder.district.toLowerCase() === full_name.toLowerCase()}>
                    {full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className='checkout__form-group'>
              <label htmlFor='' className='checkout__form-label'>
                Phường/Xã
              </label>
              <select name='ward' onChange={handleChangeWard}>
                <option value='' disabled selected={!infoOrder.ward} hidden>
                  Chọn Phường/Xã
                </option>
                {address.wards.map(({ id, full_name }: any) => (
                  <option key={id} value={id} selected={infoOrder.ward.toLowerCase() === full_name.toLowerCase()}>
                    {full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className='checkout__form-group'>
              <label htmlFor='' className='checkout__form-label'>
                Địa chỉ
              </label>
              <input type='text' name='address' value={infoOrder.address} onChange={handleChangeInput} />
            </div>
            <div className='checkout__form-group'>
              <label htmlFor='' className='checkout__form-label'>
                Loại địa chỉ
              </label>
              <div className='checkout__form-radio-group'>
                <div className='checkout__form-radio'>
                  <input
                    type='radio'
                    id='house'
                    name='typeAddress'
                    value='Nhà riêng'
                    onChange={handleChangeInput}
                    defaultChecked
                  />
                  <label htmlFor='house'>Nhà riêng / Chung cư</label>
                </div>
                <div className='checkout__form-radio'>
                  <input type='radio' name='typeAddress' id='company' value='Công ty' onChange={handleChangeInput} />
                  <label htmlFor='company'>Cơ quan / Công ty</label>
                </div>
              </div>
            </div>
          </div>
          <button className='checkout__form-submit' onClick={handleAddInfo}>
            Lưu
          </button>
        </div>
        <div className='checkout__pay checkout--bg-white'>
          <h2 className='checkout__pay--heading'>Chọn hình thức thanh toán</h2>
          <div className='checkout__pay-group'>
            <input
              type='radio'
              name='pay-radio'
              id='cash-on-delivery'
              value='cash-on-delivery'
              defaultChecked
              onChange={handleChoosePay}
            />
            <label htmlFor='cash-on-delivery'>
              <img src='https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png' alt='' />
              <span>Thanh toán tiền mặt khi nhận hàng</span>
            </label>
          </div>
          <div className='checkout__pay-group'>
            <input type='radio' name='pay-radio' id='paypal-money' value='paypal-money' onChange={handleChoosePay} />
            <label htmlFor='paypal-money'>
              <img src='https://www.pngall.com/wp-content/uploads/5/PayPal-Logo-PNG-Free-Image.png' alt='' />
              <span>Thanh toán bằng ví Paypal</span>
            </label>
          </div>
        </div>
      </div>
      <div className='checkout__right'>
        {/* {showInfo && (
          <div className='checkout__address checkout--bg-white'>
            <p className='checkout__address--title'>Giao tới</p>
            <h4>
              {user.fullName} | {user.phoneNumber}
            </h4>
            <div className='checkout__address--text'>
              <span className='tag'>{user.typeAddress}</span>
              <p>
                {user.address}, {user.ward}, {user.district}, {infoOrder.province}
              </p>
            </div>
          </div>
        )} */}
        <div className='checkout__order checkout--bg-white'>
          <div className='checkout__order-header'>
            <div className='checkout__order-title'>
              <h4 className='checkout__order--heading'>Đơn hàng</h4>
              <Link href={ROUTES.CART}>Thay đổi</Link>
            </div>
          </div>
          <div className='checkout__order-body'>
            <div className='checkout__order-price'>
              <div className='checkout__order-price-top'>
                <p className='checkout__order-price--label'>Tạm tính</p>
                <p className='checkout__order-price-price'>{formatPriceToVnd(totalPrice)}</p>
              </div>
              <div className='checkout__order-price-body'>
                <p className='checkout__order-price--label'>Tổng tiền</p>
                <p className='checkout__order-price--final'>{formatPriceToVnd(totalPrice)}</p>
              </div>
            </div>

            <button className='checkout__order-price-btn' onClick={handleCheckout}>
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
      {/* {isLoading && <Loading />} */}
    </div>
  );
}

export default CheckoutPage;
