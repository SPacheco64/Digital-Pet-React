import React, { useState } from 'react';
import '../../../styles/components/racing-minigame.scss';
import chocoboSheet from '../../graphics/canvas_sprites/chocobo-spritesheet.webp';
import chocoboIcon from '../../graphics/icons/misc-icons/chocobo.svg';
import RacingLoader from './RacingLoader';
import { RaceDifficulty } from '../../types';
import { COLOR_FILTERS, RACE_DISTANCE, useRacingLogic } from '../functions/MinigameLogic/RacingLogic';

interface RacingMinigameProps {
  difficulty: RaceDifficulty;
  earnedCurrency: number;
  currentSpeed: number;
  currentEndurance: number;
  creatureName: string;
  steeringInput: { direction: -1 | 1; sequence: number };
  sprintActive: boolean;
  setSprintActive: React.Dispatch<React.SetStateAction<boolean>>;
  onComplete: (place: number) => void;
  onClose: () => void;
}

const RacingGame: React.FC<RacingMinigameProps> = (props) => {
  const {
    difficulty,
    earnedCurrency,
    currentSpeed,
    currentEndurance,
    steeringInput,
    sprintActive,
    setSprintActive,
    onComplete,
  } = props;
  const {
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
  } = useRacingLogic({
    difficulty,
    currentSpeed,
    currentEndurance,
    steeringInput,
    sprintActive,
    setSprintActive,
    onComplete,
  });

  return (
    <section id='RacingScreen' className={`additional-screen ${frame.slowed ? 'is-slowed' : ''}`} aria-label='Chocobo race'>
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
            <div className='race-finish-line' style={{ top: `${Math.max(7, getTrackY(RACE_DISTANCE - 55))}%` }} />
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
          <div className='race-progress-track'>
            <span style={{ width: `${progress}%` }} />
            <img
              className='race-progress-chocobo'
              src={chocoboIcon}
              aria-hidden='true'
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>
        <div className='race-course-edge race-course-edge-left' />
        <div className='race-course-edge race-course-edge-right' />
      </div>

      {countdown !== null && <div className='race-countdown' role='status'>{countdown}</div>}

      {result && (
        <div className='race-result' role='status'>
          <strong>{result === 1 ? 'RACE WON!' : 'RACE FINISHED'}</strong>
          <span>{result === 1 ? 'You crossed the finish line first!' : `You placed ${result}${result === 2 ? 'nd' : result === 3 ? 'rd' : 'th'}.`}</span>
          <span>You earned {earnedCurrency}G!</span>
        </div>
      )}

      <footer className='race-instructions'>
        <span>{frame.winded ? 'WINDED...' : frame.slowed ? 'RECOVERING...' : 'ARROWS:STEER'}</span>
        <span className={sprintActive || spaceHeld.current ? 'sprint-on' : ''}>SPACE:DASH</span>
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
