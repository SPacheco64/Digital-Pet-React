import React, { useState, useEffect, ReactNode } from 'react';
import { preload } from 'react-dom';
import '../../../styles/components/loading-screen.scss';

// Import needed images for preloading
import statusBg from '../../graphics/backgrounds/status-window-bg.png';
import tracksBg from '../../graphics/backgrounds/tracks-bg.png';
import miniChocoRun from '../../graphics/creature_sprites/small_choco/choco-icon-run.gif'
import miniChocoRun2 from '../../graphics/creature_sprites/small_choco/choco-icon-run-2.gif'
import miniChocoRun3 from '../../graphics/creature_sprites/small_choco/choco-running-top.gif'
import miniChocoUp from '../../graphics/creature_sprites/small_choco/choco-looking-away.png'
import gysahlGreens from '../../graphics/icons/shop/gysahl_greens.png'
import shellTexture from '../../graphics/shell_textures/shell-texture-2.png'

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
        miniChocoRun,
        miniChocoRun2,
        miniChocoRun3,
        miniChocoUp,
        gysahlGreens
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
