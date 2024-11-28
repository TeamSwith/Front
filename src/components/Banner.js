import React from 'react';
import bannerImage from '../assets/Banner.png';

const Banner = () => {
  return (
    <div className="relative w-full mt-1 sm:mt-3">
      <img src={bannerImage} alt="Banner" className="w-full max-h-[200px] object cover" />
    </div>
  );
};

export default Banner;