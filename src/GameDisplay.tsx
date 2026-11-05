import React, { useEffect } from 'react';
import { GameDisplayProps } from './types';
import '../styles/components/game-display.scss';
import '../styles/components/loading-screen.scss';
import MoodDisplay from './MoodDisplay';
import StatusDisplay from './StatusDisplay';
import GameCanvas from './helpers/canvas/GameCanvas';
import BattleMinigame from './helpers/components/BattleMinigame';
import BattleSelectionScreen from './additional_screens/BattleSelectionScreen';
import RaceSelectionScreen from './additional_screens/RaceSelectionScreen';
import FishingMinigame from './helpers/components/FishingMinigame';
import RacingMinigame from './helpers/components/RacingMinigame';
import { preloadGymBackground, preloadShopItemsImage } from './helpers/functions/PreloadAssets';

const GameDisplay: React.FC<GameDisplayProps> = (props: GameDisplayProps) => {
  
  // Preload the gym background and shop items images when the component 
  // mounts, so that they are ready for use when the user enters the 
  // training or shop screens. Loads these in the background to avoid 
  // a bad user experience when the user enters these screens for the 
  // first time.
  useEffect(() => {
    preloadGymBackground().catch((error: unknown) => {
      console.error('Failed to preload training background:', error);
    });
    preloadShopItemsImage().catch((error: unknown) => {
      console.error('Failed to preload shop item icons:', error);
    });
  }, []);

  // Destructure props for ease of access & documentation
  const {
    inCombat,
    creatureName,
    alreadyPurchased,
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
    activity,
    onStartBattle,
    fishingInput,
    fishingEarnedCurrency,
    onFishingComplete,
    onFishingClose,
    raceDifficulty,
    raceEarnedCurrency,
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
    setCurrentlyBusy,
    setIsLoading,
    // Props for battle & race functions:
    playerAttack,
    enemyAttack,
    playerSpecial,
    enemySpecial,
    enemySpecialType,
    playerRunning,
    paralysisTurns,
    burnTurns,
    escapeComplete,
    damageToEnemy,
    damageToPlayer,
    burnDamageActive,
    specialCharge,
    enemyId
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
    <div id='GameDisplay' className={`${determineTimeClass()}${currentStatus === 'training' ? ' training-bg' : ''} game-screen`}>
      {!showMenuScreen && activity === 'pet' && isLoading &&
        <div className='minigame-loading-screen training-loading-overlay' role='status' aria-live='polite'>
          <div className='loading-text'>Loading</div>
          <span className='loader'></span>
        </div>
      }

      {/* Displayed game content */}
      {
        !showMenuScreen && activity === 'pet' &&
        <>
          <GameCanvas currentStatus={currentStatus} currentMoodIcon={currentMoodIcon} setCurrentlyBusy={setCurrentlyBusy} actionFailureTrigger={actionFailureTrigger} />
          <MoodDisplay currentMoodIcon={currentMoodIcon} />
          <StatusDisplay currentStatus={currentStatus} />
        </>
      }

      {/* Displayed battle selection content */}
      {
        !showMenuScreen && activity === 'battle-selection' &&
        <BattleSelectionScreen isLoading={isLoading} 
          battlesWon={battlesWon} 
          currentHealth={currentHealth} 
          onStartBattle={onStartBattle}
        />
      } 

      {!showMenuScreen && activity === 'race-selection' &&
        <RaceSelectionScreen onSelect={onSelectRaceDifficulty} />
      }

      {!showMenuScreen && activity === 'fishing' &&
        <FishingMinigame
          inputTrigger={fishingInput}
          earnedCurrency={fishingEarnedCurrency}
          onComplete={onFishingComplete}
          onClose={onFishingClose}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      }

      {!showMenuScreen && activity === 'race' &&
        <RacingMinigame
          difficulty={raceDifficulty}
          earnedCurrency={raceEarnedCurrency}
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
        !showMenuScreen && activity === 'battle' &&
        <BattleMinigame selectedEnemyLevel={selectedEnemyLevel} enemyId={enemyId ?? 'cactuar'} isLoading={isLoading} setIsLoading={setIsLoading}
          playerAttack={playerAttack} enemyAttack={enemyAttack} 
          playerSpecial={playerSpecial} enemySpecial={enemySpecial}
          enemySpecialType={enemySpecialType}
          playerRunning={playerRunning} paralysisTurns={paralysisTurns} burnTurns={burnTurns}
          currentHealth={currentHealth}
          escapeComplete={escapeComplete}
          maxHealth={maxHealth} currentPower={currentPower} 
          currentDefense={currentDefense} battleMessage={battleMessage}
          battleResult={battleResult} damageToEnemy={damageToEnemy} damageToPlayer={damageToPlayer}
          burnDamageActive={burnDamageActive}
          specialCharge={specialCharge}
          alreadyPurchased={alreadyPurchased}
        />
      }
    </div>
  );
};

export default GameDisplay;