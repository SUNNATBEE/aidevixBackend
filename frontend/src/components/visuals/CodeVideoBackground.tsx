'use client';

import React from 'react';

export default function CodeVideoBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[#0a0a0a]/85 backdrop-blur-[1px] z-10"></div>
      
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover grayscale opacity-30"
      >
        <source 
          src="https://assets.mixkit.co/videos/preview/mixkit-matrix-style-green-lines-falling-down-2679-large.mp4" 
          type="video/mp4" 
        />
      </video>
    </div>
  );
}
