import React from 'react';
import '../../../styles/components/fishing-minigame.scss';
import fishIcon from '../../graphics/icons/game_buttons/normal/fish.svg';
import fishingBg from '../../graphics/minigame_assets/fishing/fishing-hole-bg.avif';
import fishingSuccessBg from '../../graphics/minigame_assets/fishing/fishing-hole-bg-success.avif';
import fishingFailBg from '../../graphics/minigame_assets/fishing/fishing-hole-bg-fail.avif';
import FishingLoader from './FishingLoader';
import { LURE_WIDTH, TOTAL_ATTEMPTS, useFishingLogic } from '../functions/MinigameLogic/FishingLogic';

interface FishingMinigameProps {
  onComplete: (caughtCount: number) => void;
  onClose: () => void;
  inputTrigger: number;
  earnedCurrency: number;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const FishingMinigame: React.FC<FishingMinigameProps> = ({
  onComplete,
  onClose,
  inputTrigger,
  earnedCurrency,
  isLoading,
  setIsLoading,
}) => {
  const {
    lurePosition,
    gameState,
    caughtCount,
    targetWidth,
    currentBackground,
    handleInput,
  } = useFishingLogic({
    onComplete,
    onClose,
    inputTrigger,
    isLoading,
    fishingBackground: fishingBg,
    successBackground: fishingSuccessBg,
    failBackground: fishingFailBg,
  });

  return (
    <FishingLoader isLoading={isLoading} setIsLoading={setIsLoading}>
      <div id='FishingScreen' className='additional-screen'
        style={{ backgroundImage: `url(${currentBackground})` }}>
        <section
          className='fishing-minigame additional-screen'
          aria-live='polite'
          onClick={handleInput}
        >
          {gameState === 'fishing' ? (
            <>
              <div className='fishing-meter' aria-label='Fishing timing meter'>
                <span
                  className='fishing-target'
                  style={{
                    left: `${(100 - targetWidth) / 2}%`,
                    width: `${targetWidth}%`,
                  }}
                >
                  <img src={fishIcon} alt='Fish target' />
                </span>
                <span
                  className='fishing-lure'
                  style={{ left: `${lurePosition}%`, width: `${LURE_WIDTH}%` }}
                />
              </div>
              <div className='fishing-hint'>Press BUTTON or SPACE to reel in!</div>
            </>
          ) : gameState === 'complete' ? (
            <>
              <div className='fishing-result'>You caught {caughtCount} of {TOTAL_ATTEMPTS} fish and earned {earnedCurrency}G!</div>
              <div className='fishing-hint'>Press BACK BUTTON or SPACE to return.</div>
            </>
          ) : (
            <>
              <div className='fishing-result'>
                {gameState === 'caught' ? 'You caught a fish!' : 'The fish got away!'}
              </div>
              <div className='fishing-hint'>Press BUTTON or SPACE to continue.</div>
            </>
          )}
        </section>
      </div>
    </FishingLoader>
  );
};

export default FishingMinigame;
