'use client';

import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface SliderItem {
  id: number;
  url: string;
}

const sliderUrls: SliderItem[] = [
  { id: 1, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/d4/7a/09/a27e8ba4470c3f6159c6884859ec3fe1.png.webp' },
  { id: 2, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/35/6c/58/61212f7f5d7b83f6780e39f9418f0374.jpg.webp' },
  { id: 3, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/07/df/a1/556da3659a94abe9c953bce892691ebf.png.webp' },
  { id: 4, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/62/a1/4c/6b281bf51f22e3dadb69768cc2dfc688.png.webp' },
  { id: 5, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/de/9d/6a/3433771b443e40d8a4cebf6625e5dd44.png.webp' },
  { id: 6, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/44/89/06/5bfa1c3ba97ea917b31337cda1ea5872.png.webp' },
  { id: 7, url: 'https://salt.tikicdn.com/cache/w1080/ts/tikimsp/e5/7a/7b/0de389bea2a0189c0ed5312688e6b27e.png.webp' },
];

function Slider() {
  return (
    <div className='home__slider'>
      <div className='home__slider-list'>
        <Swiper
          cssMode={true}
          navigation={true}
          mousewheel={true}
          keyboard={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Navigation, Pagination, Mousewheel, Keyboard]}
          className='slider slider__one'
        >
          {sliderUrls.map(({ id, url }) => (
            <SwiperSlide key={id}>
              <a href='#!' className='slider__link'>
                <img src={url} alt='' />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className='home__slider-image'>
        <img
          src='https://salt.tikicdn.com/cache/w750/ts/tikimsp/d0/65/36/8df66646edcb352324cb13767d8c4fda.png.webp'
          alt=''
        />
      </div>
    </div>
  );
}

export default Slider;
