import React, { useState, useEffect, ReactNode } from 'react';
import { preload } from 'react-dom';

// Import all images for preloading
import eggGif from '../graphics/creature_sprites/egg.gif';
import petBgDay from '../graphics/backgrounds/pet-bg-day.png';
import statusBg from '../graphics/backgrounds/status-bg.png';
import chocoboAsleep from '../graphics/creature_sprites/chocobo_sprites/chocobo-asleep.gif';
import chocoboEating from '../graphics/creature_sprites/chocobo_sprites/chocobo-eating.gif';
import chocoboHappy from '../graphics/creature_sprites/chocobo_sprites/chocobo-happy.gif';
import chocoboNormal from '../graphics/creature_sprites/chocobo_sprites/chocobo-normal.gif';
import chocoboTraining from '../graphics/creature_sprites/chocobo_sprites/chocobo-training.gif';
import chocoboUpset from '../graphics/creature_sprites/chocobo_sprites/chocobo-upset.gif';

interface ImagePreloaderProps {
  children: ReactNode;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const preloadImages = () => {
    try {
      const imagePaths = [
        chocoboAsleep,
        chocoboEating,
        chocoboHappy,
        chocoboNormal,
        chocoboTraining,
        chocoboUpset,
        eggGif,
        petBgDay,
        statusBg
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
            <div className='loading-text'>Loading...</div>
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
