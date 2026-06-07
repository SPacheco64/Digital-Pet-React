import React, { useState, useEffect, ReactNode } from 'react';
import { preload } from 'react-dom';
import '../../styles/components/loading-screen.scss';

// Import all images for preloading
import eggGif from '../graphics/creature_sprites/egg.gif';
import petBgDay from '../graphics/backgrounds/pet-bg-day.png';
import petBgEvening from '../graphics/backgrounds/pet-bg-evening.png';
import petBgNight from '../graphics/backgrounds/pet-bg-night.png';
import statusBg from '../graphics/backgrounds/status-window-bg.png';
import chocoboAsleep from '../graphics/creature_sprites/chocobo_sprites/chocobo-asleep.gif';
import chocoboEating from '../graphics/creature_sprites/chocobo_sprites/chocobo-eating.gif';
import chocoboHappy from '../graphics/creature_sprites/chocobo_sprites/chocobo-happy.gif';
import chocoboNormal from '../graphics/creature_sprites/chocobo_sprites/chocobo-normal.gif';
import chocoboTraining from '../graphics/creature_sprites/chocobo_sprites/chocobo-training.gif';
import chocoboUpset from '../graphics/creature_sprites/chocobo_sprites/chocobo-upset.gif';
import daySymbol from '../graphics/time_of_day/sun.png'
import eveningSymbol from '../graphics/time_of_day/sun-cloud.png'
import nightSymbol from '../graphics/time_of_day/moon.png'

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
        petBgEvening,
        petBgNight,
        statusBg,
        daySymbol,
        eveningSymbol,
        nightSymbol
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
