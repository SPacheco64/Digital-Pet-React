import React, { useState, useEffect, ReactNode } from 'react';
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

// Preloads an image and returns a Promise that completes when loading finishes.
const loadImage = (imagePath: string) => new Promise<void>((resolve, reject) => {
  const image = new Image();

  image.onload = () => {
    image.decode()
    .then(() => resolve())
    .catch(() => resolve()); // resolve even if decoding fails, to avoid blocking the loading process
  };
  image.onerror = () => reject(new Error(`Failed to preload image: ${imagePath}`));
  image.src = imagePath;
});

// If the minimum loading time has not been met, the loading screen will continue to be displayed.
// Used to simulate the video game loading experience.
const MINIMUM_LOADING_TIME = 2000;

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ children }) => {
  const [imagesLoading, setImagesLoading] = useState<boolean>(true);

  const now = new Date();
  const hour = now.getHours();
  let bgToPreload;

  // Only preload the necessary day/evening/night background based on the current time.
  // This helps avoid preloading unnecessary images.
  bgToPreload = determineBg(hour);

  useEffect(() => {
    let isMounted = true;
    let finishTimeout: ReturnType<typeof setTimeout> | undefined;
    const loadingStartedAt = Date.now();
    const imagePaths = [
      shellTexture,
      statusBg,
      chocoSheet,
      bgToPreload,
    ];

    const finishLoading = () => {
      const remainingTime = Math.max(
        MINIMUM_LOADING_TIME - (Date.now() - loadingStartedAt),
        0,
      );

      finishTimeout = setTimeout(() => {
        if (isMounted) {
          setImagesLoading(false);
        }
      }, remainingTime);
    };

    Promise.all(imagePaths.map(loadImage))
      .then(finishLoading)
      .catch((error) => {
        console.error('Error preloading images:', error);
        finishLoading();
      });

    return () => {
      isMounted = false;
      if (finishTimeout !== undefined) {
        clearTimeout(finishTimeout);
      }
    };
  }, []);

  return (
    <>
      {
        imagesLoading &&
        <>
          <div className='loading-screen'>
            <div className='loading-text'>Loading</div>
            <span className='loader'></span>
          </div>
        </>
      }
      {
        !imagesLoading && children
      }
    </>
  );
};

export default ImagePreloader;
