import type { AddressResponse } from '@/api/addresses/type';
import React from 'react';

interface AddressCardProps {
  address: AddressResponse;
  onSelect: (address: AddressResponse, event?: React.MouseEvent<HTMLButtonElement>) => void;
  onEdit: (address: AddressResponse) => void;
  onDelete: (address: AddressResponse) => void;
  canDelete: boolean;
  isLoading: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onSelect, onEdit, onDelete, canDelete, isLoading }) => {
  console.log({ canDelete, isDefault: address.is_default });
  return (
    <div className='shipping__card'>
      {address.is_default && <span className='shipping__card__badge'>Mặc định</span>}
      <h3>{address.full_name || 'Không có tên'}</h3>
      <p>
        Địa chỉ: {address.address || 'Không có địa chỉ'}, {address.ward_name || 'Không xác định'},{' '}
        {address.district_name || 'Không xác định'}, {address.province_name || 'Không xác định'}
      </p>
      <p>Điện thoại: {address.phone_number || 'Không có số điện thoại'}</p>
      <div className='shipping__card__buttons'>
        <button
          className={`shipping__card__button ${address.is_default ? 'shipping__card__button--primary' : 'shipping__card__button--gray'}`}
          onClick={(e) => onSelect(address, e)}
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Giao đến địa chỉ này'}
        </button>
        <button
          className='shipping__card__button shipping__card__button--secondary'
          onClick={() => onEdit(address)}
          disabled={isLoading}
        >
          Sửa
        </button>
        {canDelete && (
          <button
            className='shipping__card__button shipping__card__button--secondary'
            onClick={() => onDelete(address)}
            disabled={isLoading}
          >
            Xóa
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
