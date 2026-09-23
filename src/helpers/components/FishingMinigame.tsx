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

// Size of the moving fishing lure
const LURE_WIDTH = 5;
// Initial size of the target area for catching a fish
const INITIAL_TARGET_WIDTH = 22;
// Minimum size of the target area for catching a fish
const MIN_TARGET_WIDTH = 14;
// Base speed of the moving fishing lure
const BASE_BOBBER_SPEED = 0.1;
// Maximum speed of the moving fishing lure
const MAX_BOBBER_SPEED = 0.175;
// Minimum random increment for the lure speed
const MIN_SPEED_INCREMENT = 0.01;
// Maximum random increment for the lure speed
const MAX_SPEED_INCREMENT = 0.02;
// Total number of times the user will attempt to catch a fish per game
const TOTAL_ATTEMPTS = 3;

const FishingMinigame: React.FC<FishingMinigameProps> = ({ onComplete, onClose, inputTrigger, earnedCurrency }) => {
  const [lurePosition, setLurePosition] = useState<number>(0);
  const [gameState, setGameState] = useState<'fishing' | 'caught' | 'missed' | 'complete'>('fishing');
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [caughtCount, setCaughtCount] = useState<number>(0);
  const [targetWidth, setTargetWidth] = useState<number>(INITIAL_TARGET_WIDTH);
  const lureDirection = useRef<number>(1);
  const lureSpeed = useRef<number>(BASE_BOBBER_SPEED);
  const animationFrame = useRef<number | null>(null);
  const lastInputTrigger = useRef<number>(inputTrigger);

  // Fire close function from props when the game has completed
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Sets the fishing bg animation to display based on current game state
  const currentBackground = (() => {
    if (gameState === 'fishing') {
      return fishingBg;
    } else if (gameState === 'complete') {
      // If the user caught 0 fish, it will show the failure screen at the end of the minigame.
      return caughtCount > 0 ? fishingSuccessBg : fishingFailBg;
    } else if (gameState === 'caught') {
      return fishingSuccessBg;
    } if (gameState === 'missed') {
      return fishingFailBg;
    }
    return fishingBg;
  })();

  const handleInput = useCallback(() => {
    if (gameState === 'complete') {
      handleClose();
      return;
    } else if (gameState === 'fishing') {
      const targetLeft = (100 - targetWidth) / 2;
      const targetRight = targetLeft + targetWidth;
      const lureCenter = lurePosition + LURE_WIDTH / 2;
      // If input occurs while the lure is within the target area, it is considered a catch.
      const caught = lureCenter >= targetLeft && lureCenter <= targetRight;
      setGameState(caught ? 'caught' : 'missed');
    } else if (gameState === 'caught' || gameState === 'missed') {
      const nextAttemptCount = attemptCount + 1; // Increment the attempt count for the next fishing attempt.
      const nextCaughtCount = caughtCount + (gameState === 'caught' ? 1 : 0); // Increment the caught count if the current attempt was successful.
      setAttemptCount(nextAttemptCount);
      setCaughtCount(nextCaughtCount);

      if (nextAttemptCount === TOTAL_ATTEMPTS) {
        setGameState('complete');
        onComplete(nextCaughtCount);
      } else {
        // Randomly calculate the next target area width, ensuring it 
        // doesn't go below the hard-coded minimum value.
        const nextTargetWidth = Math.max(
          MIN_TARGET_WIDTH,
          targetWidth - (3 + Math.floor(Math.random() * 2)),
        );

        // Randomly calculate the next lure speed, ensuring the increase 
        // doesn't go below the hard-coded minimum or above the 
        // hard-coded maximum.
        const speedIncrease = MIN_SPEED_INCREMENT
          + Math.random() * (MAX_SPEED_INCREMENT - MIN_SPEED_INCREMENT);
        
        // Sets all values for the next fishing attempt, and resets
        // the lure position and direction for the next attempt.
        setTargetWidth(nextTargetWidth);
        setLurePosition(0);
        lureDirection.current = 1;
        lureSpeed.current = Math.min(lureSpeed.current + speedIncrease, MAX_BOBBER_SPEED);
        setGameState('fishing');
      }
    }
  }, [attemptCount, caughtCount, gameState, handleClose, lurePosition, onComplete]);

  // This useEffect triggers the animation loop for moving the lure back and forth.
  useEffect(() => {
    let lastFrameTime = performance.now();

    const moveLure = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime;
      lastFrameTime = currentTime;

      setLurePosition((position) => {
        let nextPosition = position + lureDirection.current * elapsed * lureSpeed.current;
        if (nextPosition >= 100 - LURE_WIDTH) {
          lureDirection.current = -1;
          nextPosition = 100 - LURE_WIDTH;
        } else if (nextPosition <= 0) {
          lureDirection.current = 1;
          nextPosition = 0;
        }
        return nextPosition;
      });

      if (gameState === 'fishing') {
        animationFrame.current = requestAnimationFrame(moveLure);
      }
    };

    animationFrame.current = requestAnimationFrame(moveLure);
    
    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevents other key inputs or an already held down Spacebar from triggering the fishing attempt
      if (event.code !== 'Space' || event.repeat) { return; }
      event.preventDefault();
      // If the game is already complete, close the screen instead of attempting to fish again.
      if (gameState === 'complete') {
        handleClose();
        return;
      }
      handleInput();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleClose, handleInput]);

  // Prevents the same trigger from being processed repeatedly,
  // avoiding constant re-renders.
  useEffect(() => {
    if (inputTrigger !== lastInputTrigger.current) {
      lastInputTrigger.current = inputTrigger;
      handleInput();
    }
  }, [handleInput, inputTrigger]);

  return (
    <FishingLoader>
      <div id='FishingScreen' className='game-screen additional-screen'
        style={{ backgroundImage: `url(${currentBackground})` }}>
        <section
        className='fishing-minigame game-screen additional-screen'
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