import React from 'react';
import { GameDisplayProps } from './types';
import Creature from './Creature';
import blueberries from './graphics/food_sprites/blueberries.png';
import '../styles/components/game-display.scss';
import MoodDisplay from './MoodDisplay';
import StatusDisplay from './StatusDisplay';

const GameDisplay: React.FC<GameDisplayProps> = (props: GameDisplayProps) => {
  // Destructure props for ease of access & documentation
  const {
    inCombat,
    creatureName,
    currentStatus,
    currentHealth,
    currentHappiness,
    currentHunger,
    currentEnergy,
    currentPower,
    currentDefense,
    currentMoodIcon,
    currentTime,
    currentlyBusy,
    setCurrentlyBusy
  } = props;

  const determineTimeClass = () => {
    switch (currentTime) {
      case 'Day':
        return 'day-bg';
      case 'Evening':
        return 'evening-bg';
      default:
        return 'night-bg';
    }
  }

  return (
    <div id='GameDisplay' className={determineTimeClass()}>
      {/* Displayed game content will go here */}
      <MoodDisplay currentMoodIcon={currentMoodIcon} />
      <StatusDisplay currentStatus={currentStatus} />
      <Creature currentStatus={currentStatus} currentHappiness={currentHappiness} creatureName={creatureName} 
        setCurrentlyBusy={setCurrentlyBusy} currentlyBusy={currentlyBusy}
      />
    </div>
  );
};

export default GameDisplay;