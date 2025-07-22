'use client';

import { useCartItems } from '@/api/cart-items/query';
import { useProductsQuery } from '@/api/products/query';
import { useLocationUserQuery } from '@/api/user/query';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { useUserLogin } from '@/hooks/useUserLogin';
import { ROUTES } from '@/lib/routes';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, CircularProgress } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { type FocusEvent, useCallback, useEffect, useMemo, useState } from 'react';
import './styles.scss';

function Header() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const [suggests, setSuggests] = useState([]);
  const { refreshToken } = useAuthStore();

  const { data: userLocation } = useLocationUserQuery();

  const { logout } = useAuth();
  const { isLoggedIn, user } = useUserLogin();

  const { data: searchResults, isLoading } = useProductsQuery(
    { name: debouncedSearch, limit: 5 },
    { enabled: !!debouncedSearch }
  );
  const { data } = useCartItems({ user_id: user?.uuid ?? '' });

  useEffect(() => {
    window.addEventListener('click', handleHiddenSearch);

    return () => window.removeEventListener('click', handleHiddenSearch);
  }, [showSearch]);

  const handleOnLogout = () => {
    if (!refreshToken) return;
    logout({ refreshToken });
  };

  const handleRedirectCart = () => {};

  const handleHiddenSearch = () => setShowSearch(false);

  const handleShowSearch = (e: FocusEvent<HTMLInputElement, Element>) => {
    e.stopPropagation();
    setShowSearch(true);
  };
  // Separate handlers for better type safety
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (search.trim() && e.key === 'Enter') {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setShowSearch(false);
      setSearch('');
    }
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setShowSearch(false);
      setSearch('');
    }
  };

  const addressDefault = useMemo(() => user?.addresses?.find((address) => address.is_default), [user]);

  const getSearchProduct = useCallback(() => {
    if (isLoading)
      return (
        <div className='flex h-[200px] w-full items-center justify-center text-center'>
          <CircularProgress />
        </div>
      );

    if (!search || searchResults?.items.length === 0)
      return (
        <div className='flex h-[200px] w-full flex-col items-center justify-center gap-4 text-center'>
          <Image src='/images/empty.png' alt='' width={78} height={78} />
          <p>Không tìm thấy sản phẩm</p>
        </div>
      );
    return searchResults?.items?.map(({ uuid, name, slug, images }) => (
      <Link
        key={uuid}
        href={ROUTES.PRODUCT.replace(':slug', slug).replace(':productId', uuid)}
        className='header__search-result-link'
        onClick={() => {
          setShowSearch(false);
          setSearch('');
        }}
      >
        <img src={images?.find((img) => img.is_primary)?.url ?? ''} alt='' width={50} height={50} />
        <span className='header__search-result-text'>{name}</span>
      </Link>
    ));
  }, [isLoading, search, searchResults]);

  return (
    <>
      <header id='header' className='header'>
        <div className='container'>
          <div className='header__top'>
            <Link href='/' className=''>
              <Image src='/logo.svg' alt='Logo' width={70} height={60} />
            </Link>
            <div className='header__search' onClick={(e) => e.stopPropagation()}>
              <Image src='/images/search-icon.png' alt='' className='header__search-icon' width={20} height={20} />
              <input
                type='text'
                className='header__search-input'
                placeholder='Rẻ mỗi ngày, không chỉ một ngày'
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleSearchDown}
                onFocus={handleShowSearch}
              />
              <button className='header__search-btn' onClick={handleSearchSubmit}>
                Tìm kiếm
              </button>

              <div className={`header__search-result ${showSearch ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                {getSearchProduct()}
              </div>
            </div>
            <div className='header__action'>
              <Link href='/' className='header__action-btn header__btn-home active'>
                <Image
                  src='/images/home-blue-icon.png'
                  alt=''
                  className='header__action-btn-icon'
                  width={20}
                  height={20}
                />
                Trang chủ
              </Link>
              {!isLoggedIn && (
                <Link href='/login' className='header__btn-login'>
                  <button className={`header__action-btn header__btn-account modal__btn-open login !gap-2`}>
                    <Image
                      src='/images/smile-icon.png'
                      alt=''
                      className='header__action-btn-icon'
                      width={20}
                      height={20}
                    />
                    Đăng nhập
                  </button>
                </Link>
              )}
              {isLoggedIn && (
                <button className={`header__action-btn header__btn-account modal__btn-open login`}>
                  <Image
                    src='/images/smile-icon.png'
                    alt=''
                    className='header__action-btn-icon'
                    width={20}
                    height={20}
                  />
                  <span className='header__btn-profile'>Tài khoản</span>
                  <ul className='header__menu-dropdown'>
                    <li className='header__menu-dropdown-item header__info'>
                      <div className='header__info-avatar'>
                        <Avatar
                          src={user?.avatar || '/images/avatar.png'}
                          alt={user?.username ?? user?.full_name ?? 'Musksimpson'}
                        />
                      </div>
                      <p className='header__info-name'>{user?.username ?? user?.full_name ?? 'Musksimpson'}</p>
                    </li>
                    <li className='header__menu-dropdown-item'>
                      <Link href={ROUTES.ACCOUNT_INFO} className='header__menu-dropdown-link'>
                        Thông tin tài khoản
                      </Link>
                    </li>
                    <li className='header__menu-dropdown-item'>
                      <Link href={ROUTES.ACCOUNT_ORDERS} className='header__menu-dropdown-link'>
                        Đơn hàng của tôi
                      </Link>
                    </li>
                    <li className='header__menu-dropdown-item'>
                      <a href='#!' className='header__menu-dropdown-link header__btn-logout' onClick={handleOnLogout}>
                        Đăng xuất
                      </a>
                    </li>
                  </ul>
                </button>
              )}
              <Link href='/cart' className='header__btn-cart active' onClick={handleRedirectCart}>
                <Image
                  src='/images/cart-blue-icon.png'
                  alt=''
                  className='header__action-btn-icon'
                  width={20}
                  height={20}
                />
                <span className='header__cart-quantity'>
                  {data?.map((item) => item.quantity).reduce((a, b) => a + b, 0) ?? 0}
                </span>
              </Link>
            </div>
          </div>
          <div className='header__bottom'>
            <ul className='header__quick-menu !pl-4'>
              <li className='header__quick-item'>
                <a href='#!' className='header__quick-link'>
                  sữa, bơ, phô mai
                </a>
              </li>
              <li className='header__quick-item'>
                <a href='#!' className='header__quick-link'>
                  hải sản
                </a>
              </li>
              <li className='header__quick-item'>
                <a href='#!' className='header__quick-link'>
                  gạo, mì ăn liền
                </a>
              </li>
              <li className='header__quick-item'>
                <a href='#!' className='header__quick-link'>
                  đồ uống, bia rượu
                </a>
              </li>
              <li className='header__quick-item'>
                <a href='#!' className='header__quick-link'>
                  bánh kẹo
                </a>
              </li>
            </ul>

            <div className='header__location min-w-[400px]'>
              <div className='flex items-center gap-2'>
                <img src='/images/location-icon.png' alt='' className='header__location-icon' />
                <h5 className='header__location-title'>Giao đến:</h5>
              </div>
              {userLocation && !user?.addresses?.length && (
                <Link href='/checkout/shipping' className='header__location-address'>
                  {userLocation?.address?.village && userLocation?.address?.village.replace('Xã', 'X.')}{' '}
                  {userLocation?.address?.city_district && userLocation?.address?.city_district.replace('Huyện', 'H.')}{' '}
                  {userLocation?.address?.suburb && userLocation?.address?.suburb.replace('Quận', 'Q.')}{' '}
                  {userLocation?.address?.quarter && userLocation?.address?.quarter.replace('Phường', 'P.')}{' '}
                  {userLocation?.address?.city && userLocation?.address?.city.replace('Thành phố', 'TP.')}
                </Link>
              )}

              {user && user?.addresses?.length! > 0 && (
                <Link href='/checkout/shipping' className='header__location-address'>
                  {addressDefault?.ward_name && addressDefault?.ward_name},{' '}
                  {addressDefault?.district_name && addressDefault?.district_name},{' '}
                  {addressDefault?.province_name && addressDefault?.province_name}
                </Link>
              )}
            </div>
          </div>
          <div className='header__fixed'>
            <Link href='/' className='header__action-btn header__btn-home active'>
              <Image
                src='/images/home-blue-icon.png'
                alt=''
                className='header__action-btn-icon'
                width={20}
                height={20}
              />
              Trang chủ
            </Link>
            <button className='header__action-btn header__btn-category'>
              <Image
                src='/images/category-icon.png'
                alt=''
                className='header__action-btn-icon'
                width={20}
                height={20}
              />
              Danh mục
            </button>
            <button className='header__action-btn header__btn-chat'>
              <Image src='/images/chat-icon.png' alt='' className='header__action-btn-icon' width={20} height={20} />
              Chat
            </button>
            <button className='header__action-btn header__btn-acccount modal__btn-open'>
              <Image src='/images/smile-icon.png' alt='' className='header__action-btn-icon' width={20} height={20} />
              Tài khoản
            </button>
          </div>
        </div>
      </header>
      <div className={`overlay ${showSearch ? 'show' : ''}`} onClick={handleHiddenSearch}></div>
    </>
  );
}

export { Header };
