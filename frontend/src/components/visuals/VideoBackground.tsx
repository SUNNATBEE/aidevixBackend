'use client';

import React from 'react';

export default function VideoBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      {/* Overlay to make text readable and add professional dark look */}
      <div className="absolute inset-0 bg-[#0a0a0a]/70 backdrop-blur-[2px] z-10"></div>
      
      {/* High quality abstract tech video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source 
          src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-loop-render-40436-large.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>

      {/* Subtle bottom gradient to blend with next section */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20"></div>
    </div>
  );
}
