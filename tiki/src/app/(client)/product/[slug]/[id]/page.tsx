"use client";

import { CartQueryKey } from "@/api/cart-items/query";
import { addCartItemRequest } from "@/api/cart-items/request";
import { useProductByIdQuery } from "@/api/products/query";
import { useLocationUserQuery } from "@/api/user/query";
import { queryClient } from "@/app/providers";
import { Icons } from "@/assets/icons";
import { HStack } from "@/components/utils/h-stack";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/routes";
import {
  convertToVietnameseDate,
  formatPriceToVnd,
  onMutateError,
} from "@/lib/utils";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type ChangeEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
  FreeMode,
  Keyboard,
  Mousewheel,
  Navigation,
  Thumbs,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import "./styles.scss";

function DetailPage() {
  const { id } = useParams<{ slug: string; id: string }>();

  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { data: product } = useProductByIdQuery({ productId: id });

  const [imageItem, setImageItem] = useState<number>(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const { setCheckoutData } = useCheckoutStore();

  const { mutate: addCartItem, isPending: isAddingToCart } = useMutation({
    mutationFn: addCartItemRequest,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CartQueryKey.CART, variables.user_id],
      });
      queryClient.refetchQueries({
        queryKey: [CartQueryKey.CART, variables.user_id],
      });
      toast.success("Thêm sản phẩm vào giỏ hàng thành công");
    },
    onError: onMutateError,
  });

  const handleIncrementQuantity = () => {
    if (product?.stock && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(`Chỉ còn ${product?.stock} sản phẩm trong kho!`);
    }
  };

  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (product?.stock && value > product?.stock) {
      setQuantity(product?.stock);
      toast.error(`Chỉ còn ${product?.stock} sản phẩm trong kho!`);
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    if (!product?.uuid) {
      toast.error("Sản phẩm không hợp lệ!");
      return;
    }

    addCartItem({
      user_id: user.uuid,
      product_id: product?.uuid,
      quantity,
    });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để mua hàng!");
      return;
    }

    if (!product) return;

    const order = {
      ...product,
      quantity: quantity,
    };

    setCheckoutData({
      items: [order],
      total_amount: product?.new_price * quantity,
      type: "direct",
    });

    router.push(ROUTES.CHECKOUT);
  };

  const { data: userLocation } = useLocationUserQuery();
  const addressDefault = useMemo(
    () => user?.addresses?.find((address) => address.is_default),
    [user]
  );

  return (
    <>
      <main id="main" className="main mb-6">
        <div className="product container">
          <ul className="product__breadcrumb">
            <li className="product__breadcrumb-item">
              <a href="#!" className="product__breadcrumb-link">
                Trang chủ
              </a>
            </li>
            {product?.breadcrumbs?.map(({ name, slug }, index) => {
              if (!product?.breadcrumbs?.length) return null;
              return (
                <li key={slug} className="product__breadcrumb-item">
                  {index === product?.breadcrumbs?.length - 1 ? (
                    <span
                      className="inline-block max-w-[500px] truncate"
                      title={product?.name}
                    >
                      {product?.name}
                    </span>
                  ) : (
                    <Link
                      href={`categories/${slug}`}
                      className="product__breadcrumb-link line-clamp-1 inline-block"
                    >
                      {name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="product__info">
            <div className="product__info-image product__info--bg-white">
              <Swiper
                style={
                  {
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                  } as React.CSSProperties
                }
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                modules={[Navigation, Mousewheel, Keyboard, FreeMode, Thumbs]}
                className="product__info-image-main image-gallery__btn-open"
              >
                {product?.images?.map(({ url }, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={url}
                      alt={`${product?.name} ${index}`}
                      className={`product__info-image-item max-h-[400px] object-cover ${
                        index === imageItem ? "active" : ""
                      }`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                style={
                  {
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                  } as React.CSSProperties
                }
                onSwiper={setThumbsSwiper}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Navigation, Mousewheel, Keyboard, FreeMode, Thumbs]}
                slidesPerView={5}
                className="product__info-image-list"
              >
                {product?.images?.map(({ url }, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={url}
                      alt={`${product?.name} ${index}`}
                      className={`product__info-image-item ${
                        index === imageItem ? "active" : ""
                      }`}
                      onClick={() => setImageItem(index)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="product__info-social">
                <p>Chia sẻ:</p>
                <HStack>
                  <a href="#!" className="product__info-social-link">
                    <Icons.facebook className="size-5" />
                  </a>
                  <a href="#!" className="product__info-social-link">
                    <Icons.messenger className="size-5" />
                  </a>
                  <a href="#!" className="product__info-social-link">
                    <Icons.pinterest className="size-5" />
                  </a>
                  <a href="#!" className="product__info-social-link">
                    <Icons.x className="size-5" />
                  </a>
                  <a href="#!" className="product__info-social-link">
                    <Icons.link className="size-6" />
                  </a>
                </HStack>
              </div>
            </div>
            <div className="product__info-content">
              <div className="product__info-body">
                <div className="product__info-body-left">
                  <div className="product__info--bg-white">
                    {product?.stock === 0 && (
                      <p className="product__info--stock">Hết hàng</p>
                    )}
                    <h2 className="product__info--heading">{product?.name}</h2>
                    <div className="product__info-rating">
                      <div className="product__info-star">
                        {Array.from(
                          { length: product?.average_rating || 0 },
                          (_, index) => (
                            <span
                              key={index}
                              className="product__info-star-icon"
                            >
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 24 24"
                                color="#fdd836"
                                style={{ color: "#fdd836" }}
                                height="16"
                                width="16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                              </svg>
                            </span>
                          )
                        )}
                      </div>
                      <a
                        href="#product-comment"
                        className="product__info-watch-comment"
                      >
                        (Xem {product?.reviews?.length || 0} đánh giá)
                      </a>
                      <p className="product__info-sold">
                        Đã bán{" "}
                        {product?.sold || 0 > 1000
                          ? "1000+"
                          : product?.sold || 0}
                      </p>
                    </div>
                    <div className="product__info-price-main">
                      <h4
                        className={`product__info-price ${
                          product?.discount_percentage || 0 > 0
                            ? "discount"
                            : ""
                        }`}
                      >
                        {product?.discount_percentage || 0 > 0
                          ? formatPriceToVnd(product?.new_price || 0)
                          : formatPriceToVnd(product?.old_price || 0)}
                      </h4>
                      {product?.discount_percentage || 0 > 0 ? (
                        <p className="product__info-price--discount">
                          {formatPriceToVnd(product?.old_price || 0)}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    {/* <div className='product__info-coupon'>
                      <h4 className='product__info-coupon--title'>1 Mã Giảm Giá</h4>
                      <div className='product__info-coupon-tags'>
                        <div className='product__info-coupon-tag'>Giảm {formatPriceToK(10000)}</div>
                        <img
                          className='product__info-coupon-icon'
                          src='https://salt.tikicdn.com/ts/upload/63/43/b6/472934eece91531f0855b86a00a3b1a1.png'
                          alt='Coupon'
                        />
                      </div>
                    </div> */}
                  </div>
                  <div className="product__info--bg-white">
                    <div className="product__info-address flex flex-nowrap items-center gap-1">
                      <span>Giao đến </span>
                      <span className="product__info-address-change flex items-center gap-1">
                        {userLocation && !user?.addresses?.length && (
                          <span className="inline-block max-w-[400px] truncate underline">
                            {userLocation?.address?.village &&
                              userLocation?.address?.village.replace(
                                "Xã",
                                "X."
                              )}{" "}
                            {userLocation?.address?.city_district &&
                              userLocation?.address?.city_district.replace(
                                "Huyện",
                                "H."
                              )}{" "}
                            {userLocation?.address?.suburb &&
                              userLocation?.address?.suburb.replace(
                                "Quận",
                                "Q."
                              )}{" "}
                            {userLocation?.address?.quarter &&
                              userLocation?.address?.quarter.replace(
                                "Phường",
                                "P."
                              )}{" "}
                            {userLocation?.address?.city &&
                              userLocation?.address?.city.replace(
                                "Thành phố",
                                "TP."
                              )}
                          </span>
                        )}

                        {user && user?.addresses?.length! > 0 && (
                          <span className="inline-block max-w-[400px] truncate underline">
                            {addressDefault?.ward_name &&
                              addressDefault?.ward_name}
                            ,{" "}
                            {addressDefault?.district_name &&
                              addressDefault?.district_name}
                            ,{" "}
                            {addressDefault?.province_name &&
                              addressDefault?.province_name}
                          </span>
                        )}
                        <span className="inline-block "> - </span>
                        <Link
                          href="/checkout/shipping"
                          className="button-change inline-block "
                        >
                          Đổi địa chỉ
                        </Link>
                      </span>
                    </div>
                    <div className="product__info-delivery">
                      <div className="product__info-delivery-icon">
                        <img
                          src="https://salt.tikicdn.com/ts/upload/7f/30/d9/93a6fcd39c0045e628fdd5e48e7d26e5.png"
                          alt="Delivery"
                        />
                        <p className="product__info-delivery-time">
                          {convertToVietnameseDate(
                            product?.estimated_delivery_date ?? ""
                          )}
                        </p>
                      </div>
                      <div className="product__info-delivery-price">
                        Vận chuyển:{" "}
                        <span>{formatPriceToVnd(product?.fee || 0)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="product__info--bg-white">
                    <div className="product__detail">
                      <h3 className="product__detail--heading">
                        Thông Tin Chi Tiết
                      </h3>
                      <table className="product__detail-table">
                        <tbody>
                          {product?.specifications?.[0]?.attributes?.map(
                            ({ name, value }) => (
                              <tr
                                key={name}
                                className="product__detail-table-row"
                              >
                                <td className="product__detail-item product__detail-label">
                                  {name}
                                </td>
                                <td className="product__detail-item product__detail-value">
                                  {value}
                                </td>
                              </tr>
                            )
                          )}
                          {product?.specifications?.[1]?.attributes?.map(
                            ({ name, value }) => (
                              <tr
                                key={name}
                                className="product__detail-table-row"
                              >
                                <td className="product__detail-item product__detail-label">
                                  {name}
                                </td>
                                <td className="product__detail-item product__detail-value">
                                  {value}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="product__info--bg-white">
                    <div className="product__description">
                      <h3 className="product__description--heading">
                        Mô tả sản phẩm
                      </h3>
                      <div
                        className="[&_iframe]:aspect-video [&_iframe]:max-w-[568px] [&_img]:w-full"
                        dangerouslySetInnerHTML={{
                          __html: product?.description || "",
                        }}
                      />
                    </div>
                  </div>
                  <div className="product__info--bg-white">
                    <h1 className="product__description--heading">
                      Sản phẩm tương tự
                    </h1>
                  </div>
                </div>
                <div className="product__info-body-right product__info--bg-white">
                  <div className="product__info-quantity">
                    <span>Số Lượng</span>
                    <div className="product__info-quantity-control">
                      <button
                        disabled={quantity <= 1 || !isAuthenticated}
                        className={`product__info-quantity-btn product__info-quantity-btn--minus ${
                          quantity <= 1 ? "disable" : ""
                        }`}
                        onClick={handleDecrementQuantity}
                      >
                        <Icons.remove />
                      </button>
                      <input
                        disabled={!isAuthenticated}
                        className="product__info-quantity-input"
                        type="number"
                        value={quantity}
                        onChange={handleChangeQuantity}
                        onBlur={handleChangeQuantity}
                        min="1"
                        max={product?.stock || 0}
                      />
                      <button
                        disabled={
                          quantity >= (product?.stock || 0) || !isAuthenticated
                        }
                        className={`product__info-quantity-btn product__info-quantity-btn--plus ${
                          quantity >= (product?.stock || 0) ? "disable" : ""
                        }`}
                        onClick={handleIncrementQuantity}
                      >
                        <Icons.add />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-4">
                    <Button
                      variant="contained"
                      color="red"
                      className="product__info-btn-buy"
                      disabled={
                        quantity > (product?.stock || 0) || !isAuthenticated
                      }
                      onClick={handleCheckout}
                    >
                      Chọn mua
                    </Button>
                    <Button
                      variant="outlined"
                      className="product__info-btn-buy"
                      disabled={
                        quantity > (product?.stock || 0) ||
                        !isAuthenticated ||
                        isAddingToCart
                      }
                      onClick={handleAddToCart}
                      loading={isAddingToCart}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <CardList /> */}
        </div>
      </main>
      <div className="image-gallery">
        <button className="image-gallery__btn image-gallery__btn-prev">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g
                id="feArrowLeft0"
                fill="none"
                fillRule="evenodd"
                stroke="none"
                strokeWidth="1"
              >
                <g id="feArrowLeft1" fill="currentColor">
                  <path id="feArrowLeft2" d="m15 4l2 2l-6 6l6 6l-2 2l-8-8z" />
                </g>
              </g>
            </svg>
          </span>
          <span>Xem ảnh sau</span>
        </button>
        <div className="image-gallery__wrapper">
          <div className="image-gallery__list"></div>
        </div>
        <button className="image-gallery__btn image-gallery__btn-next">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g transform="rotate(180 12 12)">
                <g
                  id="feArrowLeft0"
                  fill="none"
                  fillRule="evenodd"
                  stroke="none"
                  strokeWidth="1"
                >
                  <g id="feArrowLeft1" fill="currentColor">
                    <path id="feArrowLeft2" d="m15 4l2 2l-6 6l6 6l-2 2l-8-8z" />
                  </g>
                </g>
              </g>
            </svg>
          </span>
          <span>Xem ảnh trước</span>
        </button>
        <button className="image-gallery__btn image-gallery__btn-close">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="m13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29l-4.3 4.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4.29-4.3l4.29 4.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z"
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
