'use client';

import React from 'react';

const GridBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="grid-pattern"></div>
      <style jsx>{`
        .grid-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 50px 50px;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          mask-image: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
          -webkit-mask-image: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
        }
      `}</style>
    </div>
  );
};

export default GridBackground; 