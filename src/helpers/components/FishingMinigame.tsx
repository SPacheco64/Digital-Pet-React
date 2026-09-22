import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../../styles/components/fishing-minigame.scss';
import fishIcon from '../../graphics/icons/game_buttons/normal/fish.svg';

interface FishingMinigameProps {
  onComplete: (caughtCount: number) => void;
  inputTrigger: number;
}

const MARKER_WIDTH = 5;
const MIN_BOBBER_SPEED = 0.1;
const MAX_BOBBER_SPEED = 0.15;
const TOTAL_CATCHES = 3;

const FishingMinigame: React.FC<FishingMinigameProps> = ({ onComplete, inputTrigger }) => {
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

  const handleInput = useCallback(() => {
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
  }, [catchCount, caughtCount, gameState, markerPosition, onComplete]);

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
      handleInput();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  useEffect(() => {
    if (inputTrigger !== lastInputTrigger.current) {
      lastInputTrigger.current = inputTrigger;
      handleInput();
    }
  }, [handleInput, inputTrigger]);

  return (
    <section className='fishing-minigame game-screen additional-screen' aria-live='polite' onClick={handleInput}>
      <h2>Fishing</h2>
      {gameState === 'fishing' ? (
        <>
          <p>Catch {catchCount + 1} of {TOTAL_CATCHES}. Click or press SPACE when the bobber reaches the green water.</p>
          <div className='fishing-meter' aria-label='Fishing timing meter'>
            <span className='fishing-target'>
              <img src={fishIcon} alt='Fish target' />
            </span>
            <span className='fishing-marker' style={{ left: `${markerPosition}%` }} />
          </div>
          <p className='fishing-hint'>Click or press SPACE to reel in</p>
        </>
      ) : gameState === 'complete' ? (
        <>
          <p className='fishing-result'>You caught {caughtCount} of {TOTAL_CATCHES} fish!</p>
          <p className='fishing-hint'>Use the back arrow to return</p>
        </>
      ) : (
        <>
          <p className='fishing-result'>
            {gameState === 'caught' ? 'You caught a fish!' : 'The fish got away!'}
          </p>
          <p className='fishing-hint'>Click or press SPACE to return</p>
        </>
      )}
    </section>
  );
};

export default FishingMinigame;