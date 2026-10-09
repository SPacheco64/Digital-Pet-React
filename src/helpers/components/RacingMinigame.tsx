import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../../styles/components/racing-minigame.scss';
import chocoboSheet from '../../graphics/canvas_sprites/chocobo-spritesheet.png';
import RacingLoader from './RacingLoader';
import { RaceDifficulty } from '../../types';

interface RacingMinigameProps {
  difficulty: RaceDifficulty;
  currentSpeed: number;
  currentEndurance: number;
  creatureName: string;
  steeringInput: { direction: -1 | 1; sequence: number };
  sprintActive: boolean;
  setSprintActive: React.Dispatch<React.SetStateAction<boolean>>;
  onComplete: (place: number) => void;
  onClose: () => void;
}

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

const RACE_DISTANCE = 1500;
const RACE_LANE_COUNT = 4;
const STARTING_RIVAL_LANES = [0, 2, 3] as const;
const RACER_COLORS = ['#d93636', '#3886db', '#45a05a',
  '#f27a00', '#911991', '#111111'];
const RIVAL_SPEED_RANGES: Record<RaceDifficulty, [number, number]> = {
  1: [40, 55],
  2: [55, 70],
  3: [75, 100],
};

// Bonus to a rival racer's chance to avoid obstacles based on difficulty level
const RIVAL_AVOIDANCE_BONUS: Record<RaceDifficulty, number> = {
  1: 0,
  2: 0.05,
  3: 0.1,
};

// Percent chance for rivals to start sprinting based on difficulty level
const RIVAL_SPRINT_CHANCE: Record<RaceDifficulty, number> = {
  1: 0.10,
  2: 0.30,
  3: 0.50,
};

// Color filters for racers and player based on their assigned colors
const COLOR_FILTERS: Record<string, string> = {
  '#d93636': 'hue-rotate(-45deg) saturate(1.5)',
  '#3886db': 'hue-rotate(165deg) saturate(1.4)',
  '#45a05a': 'hue-rotate(75deg) saturate(1.0)',
  '#f27a00': 'hue-rotate(-30deg) saturate(2)',
  '#911991': 'hue-rotate(300deg) saturate(1.5)',
  '#111111': 'hue-rotate(0deg) saturate(0)',
  player: 'hue-rotate(-10deg) saturate(1.1)',
};

const createRaceModel = (difficulty: RaceDifficulty): RaceModel => {
  const availableColors = [...RACER_COLORS];
  
  // Generates the obstacles, setting them in random lanes for each race.
  const OBSTACLES = [
    {progress: 300, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 410, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 460, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 520, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 570, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 630, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 740, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 850, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 930, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 970, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 1000, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 1100, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 1200, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 1250, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 1280, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 1330, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
    {progress: 1400, lane: Math.floor(Math.random() * RACE_LANE_COUNT)},
  ];
  
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
    obstacles: OBSTACLES,
  };
};

const RacingGame: React.FC<RacingMinigameProps> = ({
  difficulty,
  currentSpeed,
  currentEndurance,
  creatureName,
  steeringInput,
  sprintActive,
  setSprintActive,
  onComplete,
  onClose,
}) => {
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

  const steer = useCallback((direction: -1 | 1) => {
    if (completed.current) return;
    raceModel.playerLane = Math.max(0, Math.min(RACE_LANE_COUNT - 1, raceModel.playerLane + direction));
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    const countdownTimer = window.setTimeout(() => {
      setCountdown(countdown === 1 ? null : countdown - 1);
    }, 1000);
    return () => window.clearTimeout(countdownTimer);
  }, [countdown]);

  useEffect(() => {
    if (steeringInput.sequence === lastSteeringSequence.current) return;
    lastSteeringSequence.current = steeringInput.sequence;
    steer(steeringInput.direction);
  }, [steer, steeringInput]);

  useEffect(() => {
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
    const handleSpaceRelease = () => {
      spaceHeld.current = false;
      sprintActiveRef.current = false;
      setSprintActive(false);
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
  }, [steer]);

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

  return (
    <section className={`racing-screen game-screen additional-screen ${frame.slowed ? 'is-slowed' : ''}`} aria-label='Chocobo race'>
      <header className='race-hud'>
        <div className='race-distance'>
          <span>TO FINISH</span>
          <strong>{Math.max(0, Math.ceil(RACE_DISTANCE - frame.playerProgress))}m</strong>
        </div>
        <div className='race-endurance'>
          <span>DASH</span>
          <div className='endurance-meter' role='meter' aria-label='Endurance' aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(staminaPercent)}>
            <span style={{ width: `${staminaPercent}%` }} />
          </div>
        </div>
        <div className='race-position'>
          <span>PLACE</span>
          <strong>{result ? `${result}/4` : `${1 + frame.racers.filter((racer) => racer.progress > frame.playerProgress).length}/4`}</strong>
        </div>
      </header>

      <div className='race-course' aria-hidden='true'>
        <div className='race-road' style={{ backgroundPositionY: `${(frame.playerProgress * 0.8) % 162}px` }}>
          <div className='race-road-markings' />
          {RACE_DISTANCE - frame.playerProgress < 350 && (
            <div className='race-finish-line' style={{ top: `${Math.max(7, getTrackY(RACE_DISTANCE-55))}%` }} />
          )}
          {visibleRacers.map((racer) => {
            const y = getTrackY(racer.progress);
            if (y < 0 || y > 100) return null;
            return (
              <div
                key={racer.id}
                className={`race-racer race-rival ${frame.slowedRacers.includes(racer.id) ? 'is-slowed' : ''} ${frame.sprintingRacers.includes(racer.id) ? 'is-sprinting' : ''}`}
                style={{ left: `${getLaneX(racer.lane, y)}%`, top: `${y}%`, '--racer-filter': COLOR_FILTERS[racer.color] } as React.CSSProperties}
              >
                <span className='racer-sprite' style={{ backgroundImage: `url(${chocoboSheet})` }} />
              </div>
            );
          })}
          {raceModel.obstacles.map((obstacle, index) => {
            if (frame.hitObstacles.includes(index)) return null;
            const y = getTrackY(obstacle.progress);
            if (y < 2 || y > 100) return null;
            return <span key={index} className='race-obstacle' style={{ left: `${getLaneX(obstacle.lane, y)}%`, top: `${y}%`, '--track-scale': getTrackScale(y) } as React.CSSProperties} />;
          })}
          <div className='race-racer race-player' style={{ left: `${getLaneX(frame.playerLane, 76)}%` }}>
            <span className='racer-name'>{'YOU'}</span>
            <span className='racer-sprite' style={{ backgroundImage: `url(${chocoboSheet})`, '--racer-filter': COLOR_FILTERS.player } as React.CSSProperties} />
          </div>
          {frame.slowed && <div className='race-impact'>{frame.winded ? 'WINDED!' : 'BUMP!'}</div>}
          <div className='race-progress-track'><span style={{ width: `${progress}%` }} /></div>
        </div>
        <div className='race-course-edge race-course-edge-left' />
        <div className='race-course-edge race-course-edge-right' />
      </div>

      {countdown !== null && <div className='race-countdown' role='status'>{countdown}</div>}

      {result && (
        <div className='race-result' role='status'>
          <strong>{result === 1 ? 'RACE WON!' : 'RACE FINISHED'}</strong>
          <span>{result === 1 ? 'You crossed the finish line first!' : `You placed ${result}${result === 2 ? 'nd' : result === 3 ? 'rd' : 'th'}.`}</span>
        </div>
      )}

      <footer className='race-instructions'>
        <span>{frame.winded ? 'WINDED...' : frame.slowed ? 'RECOVERING...' : '←/→ STEER'}</span>
        <span className={sprintActive || spaceHeld.current ? 'sprint-on' : ''}>SPACE/DASH</span>
        <span>{`${frame.collisionCount} BUMP${frame.collisionCount !== 1 ? 'S' : ''}`}</span>
      </footer>
    </section>
  );
};

const RacingMinigame: React.FC<RacingMinigameProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <RacingLoader isLoading={isLoading} setIsLoading={setIsLoading}>
      <RacingGame {...props} />
    </RacingLoader>
  );
};

export default RacingMinigame;