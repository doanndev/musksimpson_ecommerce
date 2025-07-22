import { formatPriceToK, formatPriceToVnd } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { type ChangeEvent, useState } from 'react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Keyboard, Mousewheel, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import './styles.scss';

interface DetailPageProps {
  productName: string;
  urlPath: string;
  priceNew: number;
  priceOdd: number;
  discountProduct: number;
  deliveryDay: number;
  deliveryPrice: number;
  limitProduct: number;
  rating: number;
  reviewCount: number;
  thumbnailUrl: string;
  imageList: { image_url: string }[];
  soldProduct: number;
  description: string;
  categoryId: string;
  categoryName: string;
  shopName: string;
  breadcrumbs: { url: string; name: string; categoryId: string }[];
  specifications: { name: string; value: string }[];
}

interface CartStateLocal {
  userId?: string;
  status?: number;
  productId?: string;
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  orderId?: string;
}

function DetailPage({
  productName,
  urlPath,
  priceNew,
  priceOdd,
  discountProduct,
  deliveryDay,
  deliveryPrice,
  limitProduct,
  rating,
  reviewCount,
  thumbnailUrl,
  imageList,
  soldProduct,
  description,
  categoryId,
  categoryName,
  shopName,
  breadcrumbs,
  specifications,
}: DetailPageProps) {
  const { productId } = useParams<{ productId: string }>();

  const [imageItem, setImageItem] = useState<number>(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartStateLocal>({});

  const handleIncrementQuantity = () => {};

  const handleDecrementQuantity = () => {};

  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {};

  const handleAddToCart = async () => {};

  return (
    <>
      <main id='main' className='main'>
        <div className='product container'>
          <ul className='product__breadcrumb'>
            <li className='product__breadcrumb-item'>
              <a href='#!' className='product__breadcrumb-link'>
                Trang chủ
              </a>
            </li>
            {breadcrumbs?.map(({ url, name, categoryId }, index) => (
              <li key={url} className='product__breadcrumb-item'>
                {index === breadcrumbs.length - 1 ? (
                  <span>{productName}</span>
                ) : (
                  <a href='#!' className='product__breadcrumb-link'>
                    {name}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className='product__info'>
            <div className='product__info-image product__info--bg-white'>
              <Swiper
                style={
                  {
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                  } as React.CSSProperties
                }
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[Navigation, Mousewheel, Keyboard, FreeMode, Thumbs]}
                className='product__info-image-main image-gallery__btn-open'
              >
                {imageList?.map(({ image_url }, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image_url}
                      alt={`${productName} ${index}`}
                      className={`product__info-image-item ${index === imageItem ? 'active' : ''}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                style={
                  {
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                  } as React.CSSProperties
                }
                onSwiper={setThumbsSwiper}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Navigation, Mousewheel, Keyboard, FreeMode, Thumbs]}
                slidesPerView={5}
                className='product__info-image-list'
              >
                {imageList?.map(({ image_url }, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image_url}
                      alt={`${productName} ${index}`}
                      className={`product__info-image-item ${index === imageItem ? 'active' : ''}`}
                      onClick={() => setImageItem(index)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className='product__info-social'>
                <p>Chia sẻ:</p>
                <a href='#!' className='product__info-social-link'>
                  <img
                    src='https://frontend.tiki.com/_desktop-next/static/img/pdp_revamp_v2/social-facebook.svg'
                    alt='Facebook'
                    className='product__info-social-icon'
                  />
                </a>
                <a href='#!' className='product__info-social-link'>
                  <img
                    src='https://frontend.tiki.com/_desktop-next/static/img/pdp_revamp_v2/social-messenger.svg'
                    alt='Messenger'
                    className='product__info-social-icon'
                  />
                </a>
                <a href='#!' className='product__info-social-link'>
                  <img
                    src='https://frontend.tiki.com/_desktop-next/static/img/pdp_revamp_v2/social-pinterest.svg'
                    alt='Pinterest'
                    className='product__info-social-icon'
                  />
                </a>
                <a href='#!' className='product__info-social-link'>
                  <img
                    src='https://frontend.tiki.com/_desktop-next/static/img/pdp_revamp_v2/social-twitter.svg'
                    alt='Twitter'
                    className='product__info-social-icon'
                  />
                </a>
                <a href='#!' className='product__info-social-link'>
                  <img
                    src='https://frontend.tiki.com/_desktop-next/static/img/pdp_revamp_v2/social-copy.svg'
                    alt='Copy'
                    className='product__info-social-icon'
                  />
                </a>
              </div>
            </div>
            <div className='product__info-content'>
              <div className='product__info-body'>
                <div className='product__info-body-left'>
                  <div className='product__info--bg-white'>
                    {soldProduct === limitProduct && <p className='product__info--stock'>Hết hàng</p>}
                    <h2 className='product__info--heading'>{productName}</h2>
                    <div className='product__info-rating'>
                      <div className='product__info-star'>
                        {Array.from({ length: rating }, (_, index) => (
                          <span key={index} className='product__info-star-icon'>
                            <svg
                              stroke='currentColor'
                              fill='currentColor'
                              strokeWidth='0'
                              viewBox='0 0 24 24'
                              color='#fdd836'
                              style={{ color: '#fdd836' }}
                              height='16'
                              width='16'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'></path>
                            </svg>
                          </span>
                        ))}
                      </div>
                      <a href='#product-comment' className='product__info-watch-comment'>
                        (Xem {reviewCount} đánh giá)
                      </a>
                      <p className='product__info-sold'>Đã bán {soldProduct > 1000 ? '1000+' : soldProduct}</p>
                    </div>
                    <div className='product__info-price-main'>
                      <h4 className={`product__info-price ${discountProduct > 0 ? 'discount' : ''}`}>
                        {discountProduct > 0 ? formatPriceToVnd(priceNew) : formatPriceToVnd(priceOdd)}
                      </h4>
                      {discountProduct > 0 && (
                        <p className='product__info-price--discount'>{formatPriceToVnd(priceOdd)}</p>
                      )}
                    </div>
                    <div className='product__info-coupon'>
                      <h4 className='product__info-coupon--title'>1 Mã Giảm Giá</h4>
                      <div className='product__info-coupon-tags'>
                        <div className='product__info-coupon-tag'>Giảm {formatPriceToK(10000)}</div>
                        <img
                          className='product__info-coupon-icon'
                          src='https://salt.tikicdn.com/ts/upload/63/43/b6/472934eece91531f0855b86a00a3b1a1.png'
                          alt='Coupon'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='product__info--bg-white'>
                    <div className='product__info-address'>
                      <span>Giao đến </span>
                      <span className='product__info-address-change'>
                        <span className='underline'>Q. Hải Châu, P. Hải Châu I, Đà Nẵng</span>
                        <span> - </span>
                        <span className='button-change'>Đổi địa chỉ</span>
                      </span>
                    </div>
                    <div className='product__info-delivery'>
                      <div className='product__info-delivery-icon'>
                        <img
                          src='https://salt.tikicdn.com/ts/upload/7f/30/d9/93a6fcd39c0045e628fdd5e48e7d26e5.png'
                          alt='Delivery'
                        />
                        <p className='product__info-delivery-time'>{deliveryDay}</p>
                      </div>
                      <div className='product__info-delivery-price'>
                        Vận chuyển: <span>{formatPriceToVnd(deliveryPrice)}</span>
                      </div>
                    </div>
                  </div>
                  {/* <div className="product__info--bg-white">
                    <div className="product__detail">
                      <h3 className="product__detail--heading">Thông Tin Chi Tiết</h3>
                      <table className="product__detail-table">
                        <tbody>
                          {specifications?.[0]?.attributes.map(({ name, value }) => (
                            <tr key={name} className="product__detail-table-row">
                              <td className="product__detail-item product__detail-label">{name}</td>
                              <td className="product__detail-item product__detail-value">{value}</td>
                            </tr>
                          ))}
                          {specifications?.[1]?.attributes.map(({ name, value }) => (
                            <tr key={name} className="product__detail-table-row">
                              <td className="product__detail-item product__detail-label">{name}</td>
                              <td className="product__detail-item product__detail-value">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div> */}
                  <div className='product__info--bg-white'>
                    <div className='product__description'>
                      <h3 className='product__description--heading'>Mô tả sản phẩm</h3>
                      <div dangerouslySetInnerHTML={{ __html: description }} />
                    </div>
                  </div>
                </div>
                <div className='product__info-body-right product__info--bg-white'>
                  <div className='product__info-quantity'>
                    <span>Số Lượng</span>
                    <div className='product__info-quantity-control'>
                      <button
                        className={`product__info-quantity-btn product__info-quantity-btn--minus ${
                          quantity <= 1 ? 'disable' : ''
                        }`}
                        onClick={handleDecrementQuantity}
                      >
                        <img
                          src='https://frontend.tiki.com/_desktop-next/static/img/pdp_revamp_v2/icons-remove.svg'
                          alt='Minus'
                        />
                      </button>
                      <input
                        className='product__info-quantity-input'
                        type='number'
                        value={quantity}
                        onChange={handleChangeQuantity}
                        onBlur={handleChangeQuantity}
                        min='1'
                        max={limitProduct}
                      />
                      <button
                        className={`product__info-quantity-btn product__info-quantity-btn--plus ${
                          quantity >= limitProduct ? 'disable' : ''
                        }`}
                        onClick={handleIncrementQuantity}
                      >
                        <img
                          src='https://frontend.tiki.com/_desktop-next/static/img/pdp_revamp_v2/icons-add.svg'
                          alt='Plus'
                        />
                      </button>
                    </div>
                  </div>
                  <div className='product__info-btn'>
                    <button
                      className='product__info-btn-buy'
                      disabled={soldProduct === limitProduct}
                      onClick={handleAddToCart}
                    >
                      Chọn mua
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <CardList /> */}
        </div>
      </main>
      <div className='image-gallery'>
        <button className='image-gallery__btn image-gallery__btn-prev'>
          <span>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
              <g id='feArrowLeft0' fill='none' fillRule='evenodd' stroke='none' strokeWidth='1'>
                <g id='feArrowLeft1' fill='currentColor'>
                  <path id='feArrowLeft2' d='m15 4l2 2l-6 6l6 6l-2 2l-8-8z' />
                </g>
              </g>
            </svg>
          </span>
          <span>Xem ảnh sau</span>
        </button>
        <div className='image-gallery__wrapper'>
          <div className='image-gallery__list'></div>
        </div>
        <button className='image-gallery__btn image-gallery__btn-next'>
          <span>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
              <g transform='rotate(180 12 12)'>
                <g id='feArrowLeft0' fill='none' fillRule='evenodd' stroke='none' strokeWidth='1'>
                  <g id='feArrowLeft1' fill='currentColor'>
                    <path id='feArrowLeft2' d='m15 4l2 2l-6 6l6 6l-2 2l-8-8z' />
                  </g>
                </g>
              </g>
            </svg>
          </span>
          <span>Xem ảnh trước</span>
        </button>
        <button className='image-gallery__btn image-gallery__btn-close'>
          <span>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
              <path
                fill='white'
                d='m13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29l-4.3 4.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4.29-4.3l4.29 4.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z'
              />
            </svg>
          </span>
          <span>Đóng</span>
        </button>
      </div>
    </>
  );
}

export default DetailPage;
