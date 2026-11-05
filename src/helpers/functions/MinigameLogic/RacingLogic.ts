import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RaceDifficulty } from '../../../types';
import { VALUE_LIMITS } from '../../../constants/ValueLimits';

const getPlayEnergyCost = () => 10 + Math.floor(Math.random() * 10);
const getPlayHungerGain = () => 5 + Math.floor(Math.random() * 10);

interface Racer {
  id: string;
  lane: number;
  progress: number;
  speed: number;
  color: string;
  avoidanceChance: number;
  checkedObstacles: Set<number>;
  hitObstacles: Set<number>;
  slowdownUntil: number;
  sprintingUntil: number;
  nextSprintAt: number;
}

interface RaceModel {
  playerLane: number;
  playerProgress: number;
  stamina: number;
  racers: Racer[];
  hitObstacles: Set<number>;
  slowdownUntil: number;
  exhaustionSlowdownUntil: number;
  collisionCount: number;
  obstacles: { progress: number; lane: number }[];
}

interface RaceFrame {
  playerLane: number;
  playerProgress: number;
  stamina: number;
  racers: Racer[];
  slowedRacers: string[];
  sprintingRacers: string[];
  hitObstacles: number[];
  collisionCount: number;
  slowed: boolean;
  winded: boolean;
}

interface RacingLogicOptions {
  difficulty: RaceDifficulty;
  currentSpeed: number;
  currentEndurance: number;
  steeringInput: { direction: -1 | 1; sequence: number };
  sprintActive: boolean;
  setSprintActive: React.Dispatch<React.SetStateAction<boolean>>;
  onComplete: (place: number) => void;
}

// Constants/variables for the racing minigame.
// Updating these will update the overall gameplay experience of 
// the racing minigame.
export const RACE_DISTANCE = 1500;
const RACE_LANE_COUNT = 4;
const STARTING_RIVAL_LANES = [0, 2, 3] as const;
const RACER_COLORS = ['#d93636', '#3886db', '#45a05a', '#f27a00', '#911991', '#111111'];
const RIVAL_SPEED_RANGES: Record<RaceDifficulty, [number, number]> = {
  1: [40, 55],
  2: [55, 70],
  3: [75, 100],
};
const RIVAL_AVOIDANCE_BONUS: Record<RaceDifficulty, number> = {
  1: 0,
  2: 0.05,
  3: 0.1,
};
const RIVAL_SPRINT_CHANCE: Record<RaceDifficulty, number> = {
  1: 0.1,
  2: 0.3,
  3: 0.5,
};

// Maps enemy racer colors to CSS filter strings for visually different opponents.
export const COLOR_FILTERS: Record<string, string> = {
  '#d93636': 'hue-rotate(-45deg) saturate(1.5)',
  '#3886db': 'hue-rotate(165deg) saturate(1.4)',
  '#45a05a': 'hue-rotate(75deg) saturate(1.0)',
  '#f27a00': 'hue-rotate(-30deg) saturate(2)',
  '#911991': 'hue-rotate(300deg) saturate(1.5)',
  '#111111': 'hue-rotate(0deg) saturate(0)',
  player: 'hue-rotate(-10deg) saturate(1.1)',
};

// Generates the racers and obstacles for a race based on the selected difficulty level.
const createRaceModel = (difficulty: RaceDifficulty): RaceModel => {
  const availableColors = [...RACER_COLORS];
  const obstacles = [
    300, 410, 460, 520, 570, 630, 740, 850, 930, 970, 1000, 1100, 1200, 1250, 1280, 1330, 1400,
  ].map((progress) => ({ progress, lane: Math.floor(Math.random() * RACE_LANE_COUNT) }));

  const racers = Array.from({ length: 3 }, (_, index) => {
    const colorIndex = Math.floor(Math.random() * availableColors.length);
    const color = availableColors.splice(colorIndex, 1)[0]!;
    const [minimumSpeed, maximumSpeed] = RIVAL_SPEED_RANGES[difficulty];

    return {
      id: `rival-${index}`,
      lane: STARTING_RIVAL_LANES[index],
      progress: 0,
      speed: minimumSpeed + Math.random() * (maximumSpeed - minimumSpeed),
      color,
      avoidanceChance: Math.min(0.95, 0.65 + Math.random() * 0.25 + RIVAL_AVOIDANCE_BONUS[difficulty]),
      checkedObstacles: new Set<number>(),
      hitObstacles: new Set<number>(),
      slowdownUntil: 0,
      sprintingUntil: 0,
      nextSprintAt: 0,
    };
  });

  return {
    playerLane: 1,
    playerProgress: 0,
    stamina: 100,
    racers,
    hitObstacles: new Set<number>(),
    slowdownUntil: 0,
    exhaustionSlowdownUntil: 0,
    collisionCount: 0,
    obstacles,
  };
};

export const useRacingLogic = ({
  difficulty,
  currentSpeed,
  currentEndurance,
  steeringInput,
  sprintActive,
  setSprintActive,
  onComplete,
}: RacingLogicOptions) => {
  const [raceModel] = useState<RaceModel>(() => createRaceModel(difficulty));
  const lastSteeringSequence = useRef(steeringInput.sequence);
  const spaceHeld = useRef(false);
  const completed = useRef(false);
  const sprintActiveRef = useRef(sprintActive);
  const onCompleteRef = useRef(onComplete);
  sprintActiveRef.current = sprintActive;
  onCompleteRef.current = onComplete;
  const [result, setResult] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [frame, setFrame] = useState<RaceFrame>(() => ({
    playerLane: raceModel.playerLane,
    playerProgress: raceModel.playerProgress,
    stamina: Math.max(10, Math.min(100, currentEndurance * 10)),
    racers: raceModel.racers,
    slowedRacers: [],
    sprintingRacers: [],
    hitObstacles: [],
    collisionCount: 0,
    slowed: false,
    winded: false,
  }));

  // Handles the player's lane change based on input direction (-1 for left, 1 for right)
  const steer = useCallback((direction: -1 | 1) => {
    if (completed.current) return;
    raceModel.playerLane = Math.max(0, Math.min(RACE_LANE_COUNT - 1, raceModel.playerLane + direction));
  }, []);

  // Handles the countdown timer before the race starts
  useEffect(() => {
    if (countdown === null) return;
    const countdownTimer = window.setTimeout(() => {
      setCountdown(countdown === 1 ? null : countdown - 1);
    }, 1000);
    return () => window.clearTimeout(countdownTimer);
  }, [countdown]);

  // Handles the player's steering input and updates the player's lane accordingly
  useEffect(() => {
    if (steeringInput.sequence === lastSteeringSequence.current) return;
    lastSteeringSequence.current = steeringInput.sequence;
    steer(steeringInput.direction);
  }, [steer, steeringInput]);

  // Handles keyboard input for steering and sprinting, as well as releasing the sprint key
  useEffect(() => {
    const handleSpaceRelease = () => {
      spaceHeld.current = false;
      sprintActiveRef.current = false;
      setSprintActive(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || completed.current) return;
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        event.preventDefault();
        steer(-1);
      } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        event.preventDefault();
        steer(1);
      } else if (event.code === 'Space') {
        event.preventDefault();
        sprintActiveRef.current = false;
        setSprintActive(false);
        spaceHeld.current = true;
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') handleSpaceRelease();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleSpaceRelease);
    return () => {
      spaceHeld.current = false;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleSpaceRelease);
    };
  }, [steer, setSprintActive]);

  // Handles the main game loop, updating the race state, player and rival positions, stamina, and checking for race completion.
  useEffect(() => {
    let frameId = 0;
    let previousTime = performance.now();
    const enduranceCapacity = Math.max(10, Math.min(100, currentEndurance * 10));
    raceModel.stamina = enduranceCapacity;

    const update = (time: number) => {
      const elapsed = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      if (countdown !== null) {
        frameId = requestAnimationFrame(update);
        return;
      }
      const race = raceModel;
      const isSprinting = (sprintActiveRef.current || spaceHeld.current) && race.stamina > 0;
      const nextStamina = Math.max(0, Math.min(
        enduranceCapacity,
        race.stamina + (isSprinting ? -22 : 13) * elapsed,
      ));
      if (isSprinting && race.stamina > 0 && nextStamina === 0) {
        race.exhaustionSlowdownUntil = time + 900;
        sprintActiveRef.current = false;
        spaceHeld.current = false;
        setSprintActive(false);
      }
      const winded = time < race.exhaustionSlowdownUntil;
      const baseSpeed = 31 + Math.max(0, Math.min(currentSpeed, 10)) * 4.4;
      const slowed = time < race.slowdownUntil || winded;
      const pace = baseSpeed * (isSprinting ? 1.65 : 1) * (slowed ? 0.48 : 1);

      race.playerProgress += pace * elapsed;
      race.stamina = nextStamina;
      race.racers.forEach((racer) => {
        if (racer.nextSprintAt === 0) {
          racer.nextSprintAt = time + 900 + Math.random() * 1500;
        } else if (time >= racer.nextSprintAt) {
          if (Math.random() < RIVAL_SPRINT_CHANCE[difficulty]) {
            racer.sprintingUntil = time + 650 + Math.random() * 450;
            racer.nextSprintAt = racer.sprintingUntil + 1800 + Math.random() * 1600;
          } else {
            racer.nextSprintAt = time + 700 + Math.random() * 900;
          }
        }

        const rivalSprinting = time < racer.sprintingUntil;
        const rivalPace = racer.speed
          * (time < racer.slowdownUntil ? 0.48 : 1)
          * (rivalSprinting ? 1.45 : 1);
        racer.progress += rivalPace * elapsed;

        raceModel.obstacles.forEach((obstacle, index) => {
          const distanceToObstacle = obstacle.progress - racer.progress;
          if (obstacle.lane !== racer.lane || racer.checkedObstacles.has(index)
            || distanceToObstacle < 0 || distanceToObstacle > 60) {
            return;
          }

          racer.checkedObstacles.add(index);
          const clearLanes = Array.from({ length: RACE_LANE_COUNT }, (_, lane) => lane).filter((lane) => lane !== obstacle.lane
            && !raceModel.obstacles.some((upcoming, upcomingIndex) => upcomingIndex !== index
              && upcoming.lane === lane
              && upcoming.progress >= racer.progress
              && upcoming.progress - racer.progress <= 90));

          if (clearLanes.length > 0 && Math.random() < racer.avoidanceChance) {
            racer.lane = clearLanes[Math.floor(Math.random() * clearLanes.length)];
          }
        });

        raceModel.obstacles.forEach((obstacle, index) => {
          if (!racer.hitObstacles.has(index) && obstacle.lane === racer.lane
            && Math.abs(obstacle.progress - racer.progress) < 15) {
            racer.hitObstacles.add(index);
            racer.slowdownUntil = time + 1100;
          }
        });
      });

      raceModel.obstacles.forEach((obstacle, index) => {
        if (!race.hitObstacles.has(index) && obstacle.lane === race.playerLane
          && Math.abs(obstacle.progress - race.playerProgress) < 15) {
          race.hitObstacles.add(index);
          race.collisionCount += 1;
          race.slowdownUntil = time + 1100;
        }
      });
      const playerFinished = race.playerProgress >= RACE_DISTANCE;
      const firstRivalFinished = race.racers.some((racer) => racer.progress >= RACE_DISTANCE);
      if ((playerFinished || firstRivalFinished) && !completed.current) {
        completed.current = true;
        const finalPlace = 1 + race.racers.filter((racer) => racer.progress > race.playerProgress).length;
        setResult(finalPlace);
        setSprintActive(false);
        onCompleteRef.current(finalPlace);
      }

      setFrame({
        playerLane: race.playerLane,
        playerProgress: race.playerProgress,
        stamina: race.stamina,
        racers: race.racers.map((racer) => ({ ...racer })),
        slowedRacers: race.racers.filter((racer) => time < racer.slowdownUntil).map((racer) => racer.id),
        sprintingRacers: race.racers.filter((racer) => time < racer.sprintingUntil).map((racer) => racer.id),
        hitObstacles: [...race.hitObstacles],
        collisionCount: race.collisionCount,
        slowed,
        winded,
      });

      if (!completed.current) frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [countdown, currentEndurance, currentSpeed, difficulty, raceModel, setSprintActive]);

  // Calculates the player's progress percentage, stamina percentage, and determines which racers are visible on the track.
  const progress = Math.min(100, (frame.playerProgress / RACE_DISTANCE) * 100);
  const staminaPercent = (frame.stamina / Math.max(10, Math.min(100, currentEndurance * 10))) * 100;
  const visibleRacers = frame.racers.filter((racer) => Math.abs(racer.progress - frame.playerProgress) < 430);
  const getTrackY = (distance: number) => 75 - ((distance - frame.playerProgress) * 0.23);
  const getTrackScale = (y: number) => 0.65 + (Math.max(0, Math.min(1, (y - 14) / 70)) * 0.55);
  const getLaneX = (lane: number, y: number) => {
    const perspective = Math.max(0, Math.min(1, y / 100));
    const leftEdge = 18 * (1 - perspective);
    const rightEdge = 82 + 18 * perspective;
    return leftEdge + ((lane + 0.5) / RACE_LANE_COUNT) * (rightEdge - leftEdge);
  };

  return {
    raceModel,
    spaceHeld,
    result,
    countdown,
    frame,
    progress,
    staminaPercent,
    visibleRacers,
    getTrackY,
    getTrackScale,
    getLaneX,
  };
};

interface RaceEndOptions {
  place: number;
  difficulty: RaceDifficulty;
  setRacesWon: React.Dispatch<React.SetStateAction<number>>;
  setCurrentHappiness: React.Dispatch<React.SetStateAction<number>>;
  setCurrentHunger: React.Dispatch<React.SetStateAction<number>>;
  setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>;
  setCurrentMoney: React.Dispatch<React.SetStateAction<number>>;
  setCurrentSpeed: React.Dispatch<React.SetStateAction<number>>;
  setCurrentEndurance: React.Dispatch<React.SetStateAction<number>>;
  setRaceEarnedCurrency: React.Dispatch<React.SetStateAction<number>>;
  setRaceComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

// Handles the end of the racing minigame, updating the player's stats and 
// currency based on their finishing place and the race difficulty.
export const raceEndFunction = ({
  place,
  difficulty,
  setRacesWon,
  setCurrentHappiness,
  setCurrentHunger,
  setCurrentEnergy,
  setCurrentMoney,
  setCurrentSpeed,
  setCurrentEndurance,
  setRaceEarnedCurrency,
  setRaceComplete,
}: RaceEndOptions) => {
  const happinessChange = Math.round(
    place === 4
      ? -(5 * difficulty)
      : 20 / place + Math.floor(Math.random() * (5 * difficulty)),
  );
  const baseReward = (20 * difficulty) + Math.floor(Math.random() * (10 * difficulty));
  const placeModifier = place === 4 ? 0 : 1 / place;
  const raceReward = Math.round(baseReward * placeModifier);
  const speedIncrease = Math.round((0.2 * difficulty / place) * 10) / 10;
  const enduranceIncrease = Math.round((0.2 * difficulty / place) * 10) / 10;

  if (place === 1) setRacesWon((wins) => wins + 1);
  setCurrentHappiness((happiness) => Math.min(VALUE_LIMITS.maxHappiness, happiness + happinessChange));
  setCurrentHunger((hunger) => Math.min(VALUE_LIMITS.maxHunger, hunger + getPlayHungerGain()));
  setCurrentEnergy((energy) => Math.max(VALUE_LIMITS.minEnergy, energy - getPlayEnergyCost()));
  setCurrentMoney((money) => Math.min(VALUE_LIMITS.maxMoney, money + raceReward));
  setCurrentSpeed((speed) =>  Math.min(speed + speedIncrease, VALUE_LIMITS.maxSpd));
  setCurrentEndurance((endurance) => Math.min(VALUE_LIMITS.maxEnd, endurance + enduranceIncrease));
  setRaceEarnedCurrency(raceReward);
  setRaceComplete(true);
};
