import React, { useState, useEffect, ReactNode } from 'react';
import { preload } from 'react-dom';
import '../../../styles/components/loading-screen.scss';

// Import for images to preload
import enemySprites from '../../graphics/canvas_sprites/enemy-spritesheet.png';
import attackSprites from '../../graphics/canvas_sprites/attack-spritesheet.png';

interface BattleLoaderProps {
  children: ReactNode;
  selectedEnemyLevel: number;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const BattleLoader: React.FC<BattleLoaderProps> = ({ children, selectedEnemyLevel, isLoading, setIsLoading }) => {
    const preloadImages = () => {
    
    try {
        setIsLoading(true);

        const imagePaths = [
            enemySprites,
            attackSprites
        ];

        imagePaths.forEach((imagePath) => {
            preload(imagePath, { as: "image" });
        });

        setTimeout(() => { 
            setIsLoading(false);
        }, 2000);
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

export default BattleLoader;
