import React, { ReactNode, useEffect, useState } from 'react';
import '../../../styles/components/loading-screen.scss';
import fishingBg from '../../graphics/minigame_assets/fishing/fishing-hole-bg.avif';
import fishingSuccessBg from '../../graphics/minigame_assets/fishing/fishing-hole-bg-success.avif';
import fishingFailBg from '../../graphics/minigame_assets/fishing/fishing-hole-bg-fail.avif';

interface FishingLoaderProps {
  children: ReactNode;
}

const FishingLoader: React.FC<FishingLoaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const imagePaths = [fishingBg, fishingSuccessBg, fishingFailBg];
    const imageLoads = imagePaths.map((imagePath) => new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Failed to preload fishing image: ${imagePath}`));
      image.src = imagePath;
    }));

    Promise.all(imageLoads)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  return isLoading ? (
    <div className='minigame-loading-screen'>
      <div className='loading-text'>Loading</div>
      <span className='loader'></span>
    </div>
  ) : (
    <>{children}</>
  );
};

export default FishingLoader;
