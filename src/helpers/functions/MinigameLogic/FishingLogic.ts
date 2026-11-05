import React, { useCallback, useEffect, useRef, useState } from 'react';
import { VALUE_LIMITS } from '../../../constants/ValueLimits';

const getPlayEnergyCost = () => 10 + Math.floor(Math.random() * 10);
const getPlayHungerGain = () => 5 + Math.floor(Math.random() * 10);

export const LURE_WIDTH = 5;
const INITIAL_TARGET_WIDTH = 22;
const MIN_TARGET_WIDTH = 14;
const BASE_BOBBER_SPEED = 0.1;
const MAX_BOBBER_SPEED = 0.175;
const MIN_SPEED_INCREMENT = 0.01;
const MAX_SPEED_INCREMENT = 0.02;
export const TOTAL_ATTEMPTS = 3;

type FishingGameState = 'fishing' | 'caught' | 'missed' | 'complete';

interface FishingLogicOptions {
  onComplete: (caughtCount: number) => void;
  onClose: () => void;
  inputTrigger: number;
  isLoading: boolean;
  fishingBackground: string;
  successBackground: string;
  failBackground: string;
}

export const useFishingLogic = ({
  onComplete,
  onClose,
  inputTrigger,
  isLoading,
  fishingBackground,
  successBackground,
  failBackground,
}: FishingLogicOptions) => {
  const [lurePosition, setLurePosition] = useState(0);
  const [gameState, setGameState] = useState<FishingGameState>('fishing');
  const [attemptCount, setAttemptCount] = useState(0);
  const [caughtCount, setCaughtCount] = useState(0);
  const [targetWidth, setTargetWidth] = useState(INITIAL_TARGET_WIDTH);
  const lureDirection = useRef(1);
  const lureSpeed = useRef(BASE_BOBBER_SPEED);
  const animationFrame = useRef<number | null>(null);
  const lastInputTrigger = useRef(inputTrigger);

  const handleClose = useCallback(() => onClose(), [onClose]);

  const currentBackground = gameState === 'fishing'
    ? fishingBackground
    : gameState === 'complete'
      ? caughtCount > 0 ? successBackground : failBackground
      : gameState === 'caught' ? successBackground : failBackground;

  // Handles the logic for when the player presses the input key/button
  // Either ends the game, checks for a catch, or prepares for the next attempt
  const handleInput = useCallback(() => {
    if (gameState === 'complete') {
      handleClose();
    } else if (gameState === 'fishing') {
      const targetLeft = (100 - targetWidth) / 2;
      const targetRight = targetLeft + targetWidth;
      const lureCenter = lurePosition + LURE_WIDTH / 2;
      setGameState(lureCenter >= targetLeft && lureCenter <= targetRight ? 'caught' : 'missed');
    } else if (gameState === 'caught' || gameState === 'missed') {
      const nextAttemptCount = attemptCount + 1;
      const nextCaughtCount = caughtCount + (gameState === 'caught' ? 1 : 0);
      setAttemptCount(nextAttemptCount);
      setCaughtCount(nextCaughtCount);

      if (nextAttemptCount === TOTAL_ATTEMPTS) {
        setGameState('complete');
        onComplete(nextCaughtCount);
      } else {
        const nextTargetWidth = Math.max(
          MIN_TARGET_WIDTH,
          targetWidth - (3 + Math.floor(Math.random() * 2)),
        );
        const speedIncrease = MIN_SPEED_INCREMENT
          + Math.random() * (MAX_SPEED_INCREMENT - MIN_SPEED_INCREMENT);

        setTargetWidth(nextTargetWidth);
        setLurePosition(0);
        lureDirection.current = 1;
        lureSpeed.current = Math.min(lureSpeed.current + speedIncrease, MAX_BOBBER_SPEED);
        setGameState('fishing');
      }
    }
  }, [attemptCount, caughtCount, gameState, handleClose, lurePosition, onComplete, targetWidth]);

  // Handles the movement of the lure and checks for user input
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
      if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    };
  }, [gameState]);

  // Handles user input via keyboard events and external triggers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat || isLoading) return;
      event.preventDefault();
      handleInput();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, isLoading]);

  // Handles user input via external triggers (e.g., button clicks)
  useEffect(() => {
    if (inputTrigger !== lastInputTrigger.current) {
      lastInputTrigger.current = inputTrigger;
      handleInput();
    }
  }, [handleInput, inputTrigger]);

  return {
    lurePosition,
    gameState,
    caughtCount,
    targetWidth,
    currentBackground,
    handleInput,
  };
};

interface FishingEndOptions {
  caughtCount: number;
  setCurrentHappiness: React.Dispatch<React.SetStateAction<number>>;
  setCurrentHunger: React.Dispatch<React.SetStateAction<number>>;
  setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>;
  setCurrentMoney: React.Dispatch<React.SetStateAction<number>>;
  setFishingEarnedCurrency: React.Dispatch<React.SetStateAction<number>>;
  setFishingComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

// Handles the end of the fishing minigame, updating the player's stats and currency 
// based on the number of successful catches.
export const fishingEndFunction = ({
  caughtCount,
  setCurrentHappiness,
  setCurrentHunger,
  setCurrentEnergy,
  setCurrentMoney,
  setFishingEarnedCurrency,
  setFishingComplete,
}: FishingEndOptions) => {
  const happinessChange = caughtCount > 0
    ? caughtCount * (3 + Math.floor(Math.random() * 6))
    : -(5 + Math.floor(Math.random() * 6));
  const earnedCurrency = Array.from(
    { length: caughtCount },
    () => 7 + Math.floor(Math.random() * 7),
  ).reduce((totalReward, reward) => totalReward + reward, 0);

  setCurrentHappiness((happiness) => Math.min(happiness + happinessChange, VALUE_LIMITS.maxHappiness));
  setCurrentHunger((hunger) => Math.min(hunger + getPlayHungerGain(), VALUE_LIMITS.maxHunger));
  setCurrentEnergy((energy) => Math.max(energy - getPlayEnergyCost(), VALUE_LIMITS.minEnergy));
  setCurrentMoney((money) => Math.min(money + earnedCurrency, VALUE_LIMITS.maxMoney));
  setFishingEarnedCurrency(earnedCurrency);
  setFishingComplete(true);
};
