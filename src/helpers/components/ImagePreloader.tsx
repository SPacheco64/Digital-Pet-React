import React, { useState, useEffect, ReactNode } from 'react';
import { preload } from 'react-dom';
import '../../../styles/components/loading-screen.scss';

// Import needed images for preloading
import statusBg from '../../graphics/backgrounds/status-window-bg.png';
import tracksBg from '../../graphics/backgrounds/tracks-bg.png';
import shellTexture from '../../graphics/shell_textures/shell-texture-2.png'
import chocoSheet from '../../graphics/canvas_sprites/chocobo-spritesheet.png'

interface ImagePreloaderProps {
  children: ReactNode;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const preloadImages = () => {
    try {
      const imagePaths = [
        shellTexture,
        statusBg,
        tracksBg,
        chocoSheet
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
