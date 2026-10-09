import React, { ReactNode, useEffect, useState } from 'react';
import '../../../styles/components/loading-screen.scss';
import chocoboSheet from '../../graphics/canvas_sprites/chocobo-spritesheet.png';
import racingRoad from '../../graphics/backgrounds/racing-track-bg.png';
import racingRock from '../../graphics/minigame_assets/racing/rock.png';
import loadingBackground from '../../graphics/backgrounds/status-window-bg.png';

interface RacingLoaderProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}

const RacingLoader: React.FC<RacingLoaderProps> = ({ isLoading, setIsLoading, children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const imagePaths = [chocoboSheet, racingRoad, racingRock, loadingBackground];
    const imageLoads = imagePaths.map((imagePath) => new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Failed to preload racing image: ${imagePath}`));
      image.src = imagePath;
    }));

    Promise.all(imageLoads)
      .then(() => {
        if (isMounted) setIsLoading(false);
      })
      .catch((error: unknown) => {
        console.error('Error preloading racing images:', error);
        if (isMounted) setHasError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [setIsLoading]);

  if (isLoading || hasError) {
    return (
      <div className='minigame-loading-screen' role='status' aria-live='polite'>
        <div className='loading-text'>{hasError ? 'Unable to load race' : 'Loading'}</div>
        {!hasError && <span className='loader' />}
      </div>
    );
  }

  return <>{children}</>;
};

export default RacingLoader;
