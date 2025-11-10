
import React, { useState } from 'react';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="relative w-full h-full overflow-hidden select-none group">
      <img
        src={beforeImage}
        alt="Before"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt="After"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      </div>
      <div 
        className="absolute top-0 bottom-0 bg-white w-1 cursor-ew-resize opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="bg-white rounded-full h-10 w-10 absolute top-1/2 -left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-2xl">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0"
      />
    </div>
  );
};

export default ImageSlider;