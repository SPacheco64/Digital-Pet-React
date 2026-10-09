import React from 'react';
import { GameDisplayProps } from './types';
import '../styles/components/game-display.scss';
import MoodDisplay from './MoodDisplay';
import StatusDisplay from './StatusDisplay';
import GameCanvas from './helpers/canvas/GameCanvas';
import BattleScreen from './additional_screens/BattleScreen';
import BattleSelectionScreen from './additional_screens/BattleSelectionScreen';
import RaceSelectionScreen from './additional_screens/RaceSelectionScreen';
import FishingMinigame from './helpers/components/FishingMinigame';
import RacingMinigame from './helpers/components/RacingMinigame';

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
    battleMessage,
    battleResult,
    currentMoodIcon,
    currentTime,
    actionFailureTrigger,
    showMenuScreen,
    showBattleSelection,
    showBattleScreen,
    raceSelectionOpen,
    fishingOpen,
    fishingInput,
    fishingEarnedCurrency,
    onFishingComplete,
    onFishingClose,
    raceOpen,
    raceDifficulty,
    currentSpeed,
    currentEndurance,
    raceSteeringInput,
    sprintActive,
    setSprintActive,
    onRaceComplete,
    onRaceClose,
    onSelectRaceDifficulty,
    selectedEnemyLevel,
    currentlyBusy,
    isLoading,
    previewAnimation,
    setCurrentlyBusy,
    setIsLoading,
    setShowBattleSelection,
    setShowBattleScreen,
    setSelectedEnemyLevel,
    setInCombat,

    // Props for battle & race functions:
    playerAttack,
    enemyAttack,
    playerSpecial,
    enemySpecial,
    playerRunning,
    damageToEnemy,
    damageToPlayer,
    specialCharge
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
        !showMenuScreen && !showBattleScreen && !showBattleSelection && !raceSelectionOpen &&
        !fishingOpen && !raceOpen &&
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
          setInCombat={setInCombat}
        />
      } 

      {!showMenuScreen && raceSelectionOpen && 
        <RaceSelectionScreen onSelect={onSelectRaceDifficulty} />
      }

      {!showMenuScreen && fishingOpen &&
        <FishingMinigame
          inputTrigger={fishingInput}
          earnedCurrency={fishingEarnedCurrency}
          onComplete={onFishingComplete}
          onClose={onFishingClose}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      }

      {!showMenuScreen && raceOpen &&
        <RacingMinigame
          difficulty={raceDifficulty}
          currentSpeed={currentSpeed}
          currentEndurance={currentEndurance}
          creatureName={creatureName}
          steeringInput={raceSteeringInput}
          sprintActive={sprintActive}
          setSprintActive={setSprintActive}
          onComplete={onRaceComplete}
          onClose={onRaceClose}
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
          currentDefense={currentDefense} battleMessage={battleMessage}
          battleResult={battleResult} damageToEnemy={damageToEnemy} damageToPlayer={damageToPlayer}
          specialCharge={specialCharge}
        />
      }
    </div>
  );
};

export default GameDisplay;