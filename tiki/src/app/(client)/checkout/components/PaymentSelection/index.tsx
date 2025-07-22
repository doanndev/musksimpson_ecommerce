import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
function PaymentSelection() {
  const { control } = useFormContext();
  const handleCheckout = () => {};
  return (
    <div className='checkout__pay checkout--bg-white'>
      <h2 className='checkout__pay--heading'>Chọn hình thức thanh toán</h2>
      <Controller
        name='paymentMethod'
        control={control}
        render={({ field }) => (
          <RadioGroup {...field}>
            <div className='checkout__pay-group'>
              <FormControlLabel
                value='cash-on-delivery'
                control={<Radio />}
                label={
                  <div>
                    <img
                      src='https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png'
                      alt=''
                    />
                    <span>Thanh toán tiền mặt khi nhận hàng</span>
                  </div>
                }
              />
            </div>
            <div className='checkout__pay-group'>
              <FormControlLabel
                value='paypal-money'
                control={<Radio />}
                label={
                  <div>
                    <img src='https://www.pngall.com/wp-content/uploads/5/PayPal-Logo-PNG-Free-Image.png' alt='' />
                    <span>Thanh toán bằng ví Paypal</span>
                  </div>
                }
              />
            </div>
          </RadioGroup>
        )}
      />
    </div>
  );
}

export default PaymentSelection;
