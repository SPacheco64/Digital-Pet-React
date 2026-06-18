import React from 'react';
import { GameDisplayProps } from './types';
import '../styles/components/game-display.scss';
import MoodDisplay from './MoodDisplay';
import StatusDisplay from './StatusDisplay';
import GameCanvas from './helpers/canvas/GameCanvas';
import BattleScreen from './additional_screens/BattleScreen';

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
    showMenuScreen,
    showBattleScreen,
    currentlyBusy,
    isLoading,
    setCurrentlyBusy,
    setIsLoading,

    // Props for battle & race functions:
    playerAttack,
    enemyAttack,
    playerSpecial,
    enemySpecial,
    playerRunning
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
    <div id='GameDisplay' className={`${determineTimeClass()} game-screen`}>
      {/* Displayed game content */}
      {
        !showMenuScreen && !showBattleScreen &&
        <>
          <GameCanvas currentStatus={currentStatus} setCurrentlyBusy={setCurrentlyBusy} />
          <MoodDisplay currentMoodIcon={currentMoodIcon} />
          <StatusDisplay currentStatus={currentStatus} />
        </>
      }

      {/* Displayed battle content */}
      {
        !showMenuScreen && showBattleScreen &&
        <BattleScreen isLoading={isLoading} setIsLoading={setIsLoading} 
          playerAttack={playerAttack} enemyAttack={enemyAttack} 
          playerSpecial={playerSpecial} enemySpecial={enemySpecial} 
          playerRunning={playerRunning} 
        />
      }
    </div>
  );
};

export default GameDisplay;