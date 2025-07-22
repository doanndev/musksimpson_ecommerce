import Link from 'next/link';
import React from 'react';
import './style.scss';

interface Props {
  fullName: string;
  phoneNumber: string;
  address: string;
  typeAddress: string;
}

const CheckoutAddress = ({ fullName, phoneNumber, address, typeAddress }: Props) => {
  return (
    <div className='checkout__address checkout--bg-white'>
      <div className='checkout__address--header'>
        <p className='checkout__address--title'>Giao tới</p>
        <Link href='/checkout/shipping' className='checkout__address--tag'>
          Thay đổi
        </Link>
      </div>
      <h4>
        {fullName} | {phoneNumber}
      </h4>
      <div className='checkout__address--text'>
        <span className='tag'>{typeAddress === 'HOME' ? 'Nhà riêng' : 'Công ty'}</span>
        <p>{address}</p>
      </div>
    </div>
  );
};

export default CheckoutAddress;
