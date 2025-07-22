'use client';
import CardList from '@/components/ui/client/CardList';
import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Sidebar from './components/Sidebar';
import Slider from './components/Slider';
import './style.scss';

function HomePage() {
  return (
    <main id='main' className='main'>
      <div className='home container'>
        <Sidebar />
        <div className='home__body'>
          <Slider />
          <CardList />
        </div>
      </div>
    </main>
  );
}

export default HomePage;
