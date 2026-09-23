import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../../styles/components/fishing-minigame.scss';
import fishIcon from '../../graphics/icons/game_buttons/normal/fish.svg';
import fishingBg from '../../graphics/minigame_assets/fishing/fishing-hole-bg.avif';
import fishingSuccessBg from '../../graphics/minigame_assets/fishing/fishing-hole-bg-success.avif';
import fishingFailBg from '../../graphics/minigame_assets/fishing/fishing-hole-bg-fail.avif';
import FishingLoader from './FishingLoader';

interface FishingMinigameProps {
  onComplete: (caughtCount: number) => void;
  onClose: () => void;
  inputTrigger: number;
  earnedCurrency: number;
}

const MARKER_WIDTH = 5;
const MIN_BOBBER_SPEED = 0.1;
const MAX_BOBBER_SPEED = 0.15;
const TOTAL_CATCHES = 3;

const FishingMinigame: React.FC<FishingMinigameProps> = ({ onComplete, onClose, inputTrigger, earnedCurrency }) => {
  const [markerPosition, setMarkerPosition] = useState<number>(0);
  const [gameState, setGameState] = useState<'fishing' | 'caught' | 'missed' | 'complete'>('fishing');
  const [catchCount, setCatchCount] = useState<number>(0);
  const [caughtCount, setCaughtCount] = useState<number>(0);
  const markerDirection = useRef<number>(1);
  const bobberSpeed = useRef<number>(
    MIN_BOBBER_SPEED + Math.random() * (MAX_BOBBER_SPEED - MIN_BOBBER_SPEED)
  );
  const animationFrame = useRef<number | null>(null);
  const lastInputTrigger = useRef<number>(inputTrigger);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const currentBackground = (() => {
    if (gameState === 'fishing') {
      return fishingBg;
    }

    if (gameState === 'complete') {
      return caughtCount > 0 ? fishingSuccessBg : fishingFailBg;
    }

    if (gameState === 'caught') {
      return fishingSuccessBg;
    }

    if (gameState === 'missed') {
      return fishingFailBg;
    }

    return fishingBg;
  })();

  const handleInput = useCallback(() => {
    if (gameState === 'complete') {
      handleClose();
      return;
    }

    if (gameState === 'fishing') {
      const markerCenter = markerPosition + MARKER_WIDTH / 2;
      const caught = markerCenter >= 39 && markerCenter <= 61;
      setGameState(caught ? 'caught' : 'missed');
    } else if (gameState === 'caught' || gameState === 'missed') {
      const nextCatchCount = catchCount + 1;
      const nextCaughtCount = caughtCount + (gameState === 'caught' ? 1 : 0);

      setCatchCount(nextCatchCount);
      setCaughtCount(nextCaughtCount);

      if (nextCatchCount === TOTAL_CATCHES) {
        setGameState('complete');
        onComplete(nextCaughtCount);
      } else {
        setMarkerPosition(0);
        markerDirection.current = 1;
        bobberSpeed.current = MIN_BOBBER_SPEED + Math.random() * (MAX_BOBBER_SPEED - MIN_BOBBER_SPEED);
        setGameState('fishing');
      }
    }
  }, [catchCount, caughtCount, gameState, handleClose, markerPosition, onComplete]);

  useEffect(() => {
    let lastFrameTime = performance.now();

    const moveMarker = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime;
      lastFrameTime = currentTime;

      setMarkerPosition((position) => {
        let nextPosition = position + markerDirection.current * elapsed * bobberSpeed.current;
        if (nextPosition >= 100 - MARKER_WIDTH) {
          markerDirection.current = -1;
          nextPosition = 100 - MARKER_WIDTH;
        } else if (nextPosition <= 0) {
          markerDirection.current = 1;
          nextPosition = 0;
        }
        return nextPosition;
      });

      if (gameState === 'fishing') {
        animationFrame.current = requestAnimationFrame(moveMarker);
      }
    };

    animationFrame.current = requestAnimationFrame(moveMarker);
    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat) {
        return;
      }

      event.preventDefault();

      if (gameState === 'complete') {
        handleClose();
        return;
      }

      handleInput();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleClose, handleInput]);

  useEffect(() => {
    if (inputTrigger !== lastInputTrigger.current) {
      lastInputTrigger.current = inputTrigger;
      handleInput();
    }
  }, [handleInput, inputTrigger]);

  return (
    <div id='FishingScreen' className='game-screen additional-screen'
      style={{ backgroundImage: `url(${currentBackground})` }}>
      <FishingLoader>
        <section
        className='fishing-minigame game-screen additional-screen'
        aria-live='polite'
        onClick={handleInput}
      >
        {gameState === 'fishing' ? (
          <>
            <div className='fishing-meter' aria-label='Fishing timing meter'>
              <span className='fishing-target'>
                <img src={fishIcon} alt='Fish target' />
              </span>
              <span className='fishing-marker' style={{ left: `${markerPosition}%` }} />
            </div>
            <p className='fishing-hint'>Press BUTTON or SPACE to reel in!</p>
          </>
        ) : gameState === 'complete' ? (
          <>
            <p className='fishing-result'>You caught {caughtCount} of {TOTAL_CATCHES} fish and earned {earnedCurrency}G!</p>
            <p className='fishing-hint'>Press BACK BUTTON or SPACE to return.</p>
          </>
        ) : (
          <>
            <p className='fishing-result'>
              {gameState === 'caught' ? 'You caught a fish!' : 'The fish got away!'}
            </p>
            <p className='fishing-hint'>Press BUTTON or SPACE to continue.</p>
          </>
        )}
        </section>
      </FishingLoader>
    </div>
  );
};

export default FishingMinigame;