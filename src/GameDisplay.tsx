import React from 'react';
import { GameDisplayProps } from './types';
import '../styles/components/game-display.scss';
import MoodDisplay from './MoodDisplay';
import StatusDisplay from './StatusDisplay';
import GameCanvas from './helpers/canvas/GameCanvas';
import BattleScreen from './additional_screens/BattleScreen';
import BattleSelectionScreen from './additional_screens/BattleSelectionScreen';

const GameDisplay: React.FC<GameDisplayProps> = (props: GameDisplayProps) => {
  // Destructure props for ease of access & documentation
  const {
    inCombat,
    creatureName,
    currentStatus,
    currentHealth,
    battlesWon,
    maxHealth,
    currentHappiness,
    currentHunger,
    currentEnergy,
    currentPower,
    currentDefense,
    currentMoodIcon,
    currentTime,
    actionFailureTrigger,
    showMenuScreen,
    showBattleSelection,
    showBattleScreen,
    selectedEnemyLevel,
    currentlyBusy,
    isLoading,
    previewAnimation,
    setCurrentlyBusy,
    setIsLoading,
    setShowBattleSelection,
    setShowBattleScreen,
    setSelectedEnemyLevel,

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
          <GameCanvas currentStatus={currentStatus} previewAnimation={previewAnimation} setCurrentlyBusy={setCurrentlyBusy} actionFailureTrigger={actionFailureTrigger} />
          <MoodDisplay currentMoodIcon={currentMoodIcon} />
          <StatusDisplay currentStatus={currentStatus} />
        </>
      }

      {/* Displayed battle selection content */}
      {
        !showMenuScreen && showBattleSelection &&
        <BattleSelectionScreen isLoading={isLoading} 
          battlesWon={battlesWon} 
          currentHealth={currentHealth} 
          setIsLoading={setIsLoading} 
          setShowBattleSelection={setShowBattleSelection}
          setShowBattleScreen={setShowBattleScreen}
          setSelectedEnemyLevel={setSelectedEnemyLevel}
        />
      } 

      {/* Displayed battle content */}
      {
        !showMenuScreen && showBattleScreen &&
        <BattleScreen selectedEnemyLevel={selectedEnemyLevel} isLoading={isLoading} setIsLoading={setIsLoading} 
          playerAttack={playerAttack} enemyAttack={enemyAttack} 
          playerSpecial={playerSpecial} enemySpecial={enemySpecial} 
          playerRunning={playerRunning} currentHealth={currentHealth}
          maxHealth={maxHealth} currentPower={currentPower} 
          currentDefense={currentDefense}
        />
      }
    </div>
  );
};

export default GameDisplay;