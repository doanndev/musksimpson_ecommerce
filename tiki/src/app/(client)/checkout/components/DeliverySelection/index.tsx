'use client';

import { formatPriceToVnd } from '@/lib/utils'; // Assuming this formats price to VND
import { useCheckoutStore } from '@/stores/checkoutStore';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

function DeliverySelection() {
  const { selectedProducts } = useCheckoutStore();

  const formatDeliveryDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Không xác định';
    try {
      const date = new Date(dateString);
      return dayjs(date)
        .locale('vi')
        .format('dddd, HH:mm, DD/MM')
        .replace(/^\w/, (c) => c.toUpperCase());
    } catch {
      return 'Không xác định';
    }
  };

  const totalFee = selectedProducts.items.reduce((acc, item) => acc + (item.fee || 0), 0);

  return (
    <div className='flex w-full items-center justify-center bg-gray-100'>
      <div className='w-full rounded-lg bg-white p-6'>
        <h2 className='mb-3 font-medium text-gray-800 text-lg' data-id='q14cawmi' data-line='45-45'>
          Chọn hình thức giao hàng
        </h2>

        <div className='speech-bubble relative mb-6 p-3' data-id='7cqj3zzm' data-line='48-56'>
          <div className='flex items-center gap-3' data-id='80s69ge4' data-line='49-55'>
            <div
              className='flex h-4 w-4 items-center justify-center rounded-full border-2 border-blue-500'
              data-id='xno4ic1j'
              data-line='50-52'
            >
              <div className='h-2 w-2 rounded-full bg-blue-500' data-id='h7a95s80' data-line='51-51'></div>
            </div>
            <span className='text-sm' data-id='plmwlxmm' data-line='53-53'>
              Giao tiết kiệm
            </span>
            <span
              className='ml-2 rounded-md bg-green-50 px-2 py-0.5 font-medium text-green-700 text-xs'
              data-id='xopj2uwx'
              data-line='54-54'
            >
              -{formatPriceToVnd(totalFee)}
            </span>
          </div>
        </div>

        <div className='mb-4 rounded-lg border border-gray-200 bg-white p-4' data-id='gur65abk' data-line='59-115'>
          <div
            className='mb-3 flex items-center gap-2 font-semibold text-green-600 text-sm'
            data-id='sesqbfah'
            data-line='61-64'
          >
            <span data-id='5zns9stu' data-line='63-63'>
              Gói:{' '}
              {selectedProducts.items.length > 0
                ? formatDeliveryDate(selectedProducts.items[0].estimated_delivery_date)
                : 'Không xác định'}
            </span>
          </div>

          <div className='mb-4' data-id='du04ne7m' data-line='67-76'>
            <div className='flex items-center justify-between' data-id='oxsjxafk' data-line='68-75'>
              <h3 className='font-semibold text-sm uppercase' data-id='47jvou15' data-line='69-69'>
                GIAO TIẾT KIỆM
              </h3>
              <div className='flex items-center gap-2' data-id='tfzkwvro' data-line='70-74'>
                <span className='text-gray-500 text-sm line-through' data-id='s02g4pc2' data-line='71-71'>
                  {formatPriceToVnd(totalFee + 100000)} {/* Example: original fee + 100K */}
                </span>
                <span className='font-semibold text-base text-red-600' data-id='dufiv0sk' data-line='72-72'>
                  {formatPriceToVnd(totalFee)}
                </span>
                <i className='fas fa-info-circle text-gray-400' data-id='4oiq8fc0' data-line='73-73'></i>
              </div>
            </div>
          </div>

          <div className='mb-4 space-y-3' data-id='xrvt8c4h' data-line='79-108'>
            {selectedProducts.items.length > 0 ? (
              selectedProducts.items.map((product) => (
                <div key={product.uuid} className='flex items-start gap-3' data-id='eptisqej'>
                  <img
                    src={product.images?.find((img) => img.is_primary)?.url || 'https://via.placeholder.com/40'}
                    alt={product.name}
                    className='h-10 w-10 rounded border border-gray-100 object-cover'
                    loading='lazy'
                    data-id='ji9kc3cp'
                  />
                  <div className='flex-1' data-id='tmdoso2o'>
                    <p className='line-clamp-2 text-sm' data-id='efz6iiqz'>
                      {product.name}
                    </p>
                    <p className='mt-1 text-gray-500 text-xs' data-id='nd96ata5'>
                      SL: x{product.quantity}
                    </p>
                    <p className='mt-1 text-gray-500 text-xs'>
                      Giao hàng dự kiến: {formatDeliveryDate(product.estimated_delivery_date)}
                    </p>
                  </div>
                  <div className='text-right' data-id='m8f6h0vr'>
                    {product.old_price !== product.new_price && (
                      <p className='text-gray-500 text-sm line-through' data-id='u3ezuhhw'>
                        {formatPriceToVnd(product.old_price || product.new_price)}
                      </p>
                    )}
                    <div className='flex items-center gap-1' data-id='i8u1vdkr'>
                      <span className='font-semibold text-sm' data-id='ets5w6f6'>
                        {formatPriceToVnd(product.new_price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-sm'>Không có sản phẩm nào trong giỏ hàng.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliverySelection;
