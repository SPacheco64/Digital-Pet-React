import React, { useState, useEffect, ReactNode } from 'react';
import { preload } from 'react-dom';
import '../../../styles/components/loading-screen.scss';

// Import for images to preload
import statusBg from '../../graphics/backgrounds/status-window-bg.png';
import shellTexture from '../../graphics/shell_textures/shell-texture.png'
import chocoSheet from '../../graphics/canvas_sprites/chocobo-spritesheet.png'
import dayBg from '../../graphics/backgrounds/pet-bg-day.png';
import eveningBg from '../../graphics/backgrounds/pet-bg-evening.png';
import nightBg from '../../graphics/backgrounds/pet-bg-night.png';

interface ImagePreloaderProps {
  children: ReactNode;
}

// Used to determine the bgImg that needs to actually be preloaded
// (Avoids preloading unnecessary images)
const determineBg = (hour: number) => {
  if (hour >= 6 && hour < 18) {
    return dayBg;
  } else if (hour >= 18 && hour < 21) {
    return eveningBg;
  } else {
    return nightBg;
  }
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const now = new Date();
  const hour = now.getHours();
  let bgToPreload;

  bgToPreload = determineBg(hour);

  const preloadImages = () => {
    try {
      const imagePaths = [
        shellTexture,
        statusBg,
        chocoSheet,
        bgToPreload,
      ];

      imagePaths.forEach((imagePath) => {
        preload(imagePath, { as: "image" });
      });

      // setIsLoading(false);
      setTimeout(() => { 
        setIsLoading(false);
      }, 2000); // Simulate loading time
    } catch (error) {
      console.error('Error preloading images:', error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    preloadImages();
  }, []);

  return (
    <>
      {
        isLoading &&
        <>
          <div className='loading-screen'>
            <div className='loading-text'>Loading</div>
            <span className='loader'></span>
          </div>
        </>
      }
      {
        !isLoading && children
      }
    </>
  );
};

export default ImagePreloader;
