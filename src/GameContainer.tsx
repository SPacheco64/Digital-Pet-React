import React, { useState, useEffect, useRef } from 'react';
import { GameActivity, GameContainerProps, RaceDifficulty } from './types';
import GameDisplay from './GameDisplay';
import Menu from './Menu';
import '../styles/components/game-container.scss';
import StartupPreloader from './helpers/components/StartupPreloader';
import ExternalUI from './ExternalUI';
import { eatFunction, hatchingEvent, saveFunction, trainingFunction, sleepingFunction } from './helpers/functions/OperationalFunctions';
import QuestionWindow from './helpers/components/QuestionWindow';
import MenuScreen from './additional_screens/MenuScreen';
import StatusScreen from './additional_screens/StatusScreen';
import AchievementScreen from './additional_screens/AchievementScreen';
import InfoScreen from './additional_screens/InfoScreen';
import ShopScreen from './additional_screens/ShopScreen';
import WelcomeForm from './helpers/components/WelcomeForm';
import { attackFunction, battleEndFunction, createEnemyForDifficulty, EnemyInformation, enemyAttackFunction, escapeFunction, specialFunction } from './helpers/functions/MinigameLogic/BattleLogic';
import { fishingEndFunction } from './helpers/functions/MinigameLogic/FishingLogic';
import { raceEndFunction } from './helpers/functions/MinigameLogic/RacingLogic';
import { parseChocoboSaveData } from './helpers/functions/DataManagement/SaveData';
import { createSaveData, handleReset, handleSave, handleSaveRecovery, reportSaveError } from './helpers/functions/DataManagement/SaveManagement';
import { preloadGymBackground } from './helpers/functions/PreloadAssets';
import { setAudioMuted } from './helpers/functions/AudioPlayer';
import { VALUE_LIMITS } from './constants/ValueLimits';

const DEFAULT_BATTLE_MESSAGE = 'What will you do?';
const BATTLE_MESSAGE_DURATION = 1000;

const GameContainer: React.FC<GameContainerProps> = (props: GameContainerProps) => {
  // Destructure props for ease of access & documentation
  const {

  } = props;

  // User & Chocobo Names
  const [playerName, setPlayerName] = useState<string>('');
  const [chocoboName, setChocoboName] = useState<string>('');

  // State variables for game status
  const [dataExists, setDataExists] = useState<boolean>(false);
  const [hideWelcome, setHideWelcome] = useState<boolean>(false);
  const [autosaveEnabled, setAutosaveEnabled] = useState<boolean>(true);
  const [storageHydrated, setStorageHydrated] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveRecoveryRequired, setSaveRecoveryRequired] = useState<boolean>(false);
  const [storageReadFailed, setStorageReadFailed] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('Day');
  const [currentShellColor, setCurrentShellColor] = useState<string>('orange');
  const [retroMode, setRetroMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentlyBusy, setCurrentlyBusy] = useState<boolean>(false);
  const [questionWindowOpen, setQuestionWindowOpen] = useState<boolean>(false);
  const [currentQuestionType, setCurrentQuestionType] = useState<string>(''); // training, play
  const [optionSelected, setOptionSelected] = useState<number>(0);
  const [showMenuScreen, setShowMenuScreen] = useState<boolean>(false);
  const [activity, setActivity] = useState<GameActivity>('pet');
  const [selectedEnemyLevel, setSelectedEnemyLevel] = useState<number>(1);
  const [showStatusScreen, setShowStatusScreen] = useState<boolean>(false);
  const [showShopScreen, setShowShopScreen] = useState<boolean>(false);
  const [showAchievementsScreen, setShowAchievementsScreen] = useState<boolean>(false);
  const [showInfoScreen, setShowInfoScreen] = useState<boolean>(false);
  const [inCombat, setInCombat] = useState<boolean>(false);
  const [battlesWon, setBattlesWon] = useState<number>(0);
  const [racesWon, setRacesWon] = useState<number>(0);
  const [currentMoney, setCurrentMoney] = useState<number>(0);
  const [alreadyPurchased, setAlreadyPurchased] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fishingComplete, setFishingComplete] = useState<boolean>(false);
  const [fishingInput, setFishingInput] = useState<number>(0);
  const [fishingEarnedCurrency, setFishingEarnedCurrency] = useState<number>(0);
  const [raceEarnedCurrency, setRaceEarnedCurrency] = useState<number>(0);
  const [raceDifficulty, setRaceDifficulty] = useState<RaceDifficulty>(2);
  const [raceComplete, setRaceComplete] = useState<boolean>(false);
  const [raceSteeringInput, setRaceSteeringInput] = useState<{ direction: -1 | 1; sequence: number }>({ direction: 1, sequence: 0 });
  const [sprintActive, setSprintActive] = useState<boolean>(false);
  const [battlesLost, setBattlesLost] = useState<number>(0); // Going to track losses to track Chocobo death
  const [specialCharge, setSpecialCharge] = useState<number>(0);

  // State Values for Creature Information
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [currentHealth, setCurrentHealth] = useState<number>(100);
  const [maxHealth, setMaxHealth] = useState<number>(100);
  const [currentEnergy, setCurrentEnergy] = useState<number>(100);
  const [maxEnergy, setMaxEnergy] = useState<number>(100);
  const [currentHappiness, setCurrentHappiness] = useState<number>(50);
  const [currentHunger, setCurrentHunger] = useState<number>(50);
  const [currentPower, setCurrentPower] = useState<number>(1);
  const [currentDefense, setCurrentDefense] = useState<number>(1);
  const [currentSpeed, setCurrentSpeed] = useState<number>(1);
  const [currentEndurance, setCurrentEndurance] = useState<number>(1);
  const [currentMoodIcon, setCurrentMoodIcon] = useState<string>('Normal');
  const [actionFailureTrigger, setActionFailureTrigger] = useState<number>(0);
  const previousEnergy = useRef<number>(currentEnergy);

  useEffect(() => {
    setAudioMuted(isMuted);
  }, [isMuted]);

  const saveData = createSaveData({
    playerName,
    chocoboName,
    currentShellColor,
    retroMode,
    isMuted,
    currentHealth,
    maxHealth,
    currentEnergy,
    maxEnergy,
    currentHappiness,
    currentHunger,
    currentPower,
    currentDefense,
    currentSpeed,
    currentEndurance,
    currentMoodIcon,
    currentMoney,
    alreadyPurchased,
    battlesWon,
    battlesLost,
    racesWon,
    specialCharge,
  });

  // Battle State Values
  const [playerAttack, setPlayerAttack] = useState<boolean>(false);
  const [enemyAttack, setEnemyAttack] = useState<boolean>(false);
  const [playerSpecial, setPlayerSpecial] = useState<boolean>(false);
  const [enemySpecial, setEnemySpecial] = useState<boolean>(false);
  const [playerRunning, setPlayerRunning] = useState<boolean>(false);
  const [battleLocked, setBattleLocked] = useState<boolean>(false);
  const [enemyInfo, setEnemyInfo] = useState<EnemyInformation | null>(null);
  const [currentEnemyHealth, setCurrentEnemyHealth] = useState<number>(0);
  const [battleMessage, setBattleMessage] = useState<string>(DEFAULT_BATTLE_MESSAGE);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [escapeComplete, setEscapeComplete] = useState<boolean>(false);
  const [damageToEnemy, setDamageToEnemy] = useState<number>(0);
  const [damageToPlayer, setDamageToPlayer] = useState<number>(0);
  const [burnDamageActive, setBurnDamageActive] = useState<boolean>(false);
  const [paralysisTurns, setParalysisTurns] = useState<number>(0);
  const [burnTurns, setBurnTurns] = useState<number>(0);
  const burnDamageTimeout = useRef<number | null>(null);

  const handleFishingComplete = (caughtCount: number) => fishingEndFunction({
    caughtCount,
    setCurrentHappiness,
    setCurrentHunger,
    setCurrentEnergy,
    setCurrentMoney,
    setFishingEarnedCurrency,
    setFishingComplete,
  });

  const handleRaceComplete = (place: number) => raceEndFunction({
    place,
    difficulty: raceDifficulty,
    setRacesWon,
    setCurrentHappiness,
    setCurrentHunger,
    setCurrentEnergy,
    setCurrentMoney,
    setCurrentSpeed,
    setCurrentEndurance,
    setRaceEarnedCurrency,
    setRaceComplete,
  });

  // Applies burn damage at the end of the player's turn, reducing health and 
  // updating battle state.
  const applyBurnAtTurnEnd = (healthAtTurnEnd: number) => {
    if (burnTurns <= 0) {
      return false;
    }

    const burnDamage = Math.min(healthAtTurnEnd, Math.round(maxHealth * 0.1));
    const remainingHealth = Math.max(healthAtTurnEnd - burnDamage, VALUE_LIMITS.minHP);
    setCurrentHealth(remainingHealth);
    setDamageToPlayer(burnDamage);
    setBurnDamageActive(true);
    setBurnTurns((turns) => Math.max(0, turns - 1));
    setBattleMessage(`Burn deals ${burnDamage} damage!`);

    if (burnDamageTimeout.current !== null) {
      window.clearTimeout(burnDamageTimeout.current);
    }
    burnDamageTimeout.current = window.setTimeout(() => {
      setBurnDamageActive(false);
      burnDamageTimeout.current = null;
    }, 800);

    return remainingHealth === 0;
  };

  // Prepares the player's turn, handling paralysis and burn effects.
  const preparePlayerTurn = () => {
    if (paralysisTurns > 0 && enemyInfo) {
      setParalysisTurns((turns) => Math.max(0, turns - 1));
      setBattleLocked(true);
      enemyAttackFunction({
        setEnemyAttack,
        setEnemySpecial,
        setBattleLocked,
        setBattleMessage,
        setCurrentHealth,
        setDamageToPlayer,
        setSpecialCharge,
        setParalysisTurns,
        setBurnTurns,
        applyParalysis: false,
        currentHealth,
        currentDefense,
        enemyInfo,
        alreadyPurchased,
        onComplete: (result, _paralyzed, remainingHealth) => {
          if (result) {
            setBattleLocked(false);
            setBattleResult(result);
            setInCombat(false);
            return;
          }
          if (applyBurnAtTurnEnd(remainingHealth)) {
            setBattleLocked(false);
            setBattleResult('defeat');
            setInCombat(false);
            return;
          }
          setBattleMessage(`${chocoboName} can't move!`);
          setBattleLocked(false);
        },
      });
      return { canAct: false, health: currentHealth };
    }

    return { canAct: true, health: currentHealth };
  };
  // Handles the player's attack action, including turn preparation and 
  // battle logic.
  const handleAttack = () => {
    if (isLoading || battleLocked || !enemyInfo || currentEnemyHealth <= 0 || currentHealth <= 0) {
      return;
    }

    const turn = preparePlayerTurn();
    if (!turn.canAct) return;

    setBattleLocked(true);
    attackFunction({
      setPlayerAttack,
      setEnemyAttack,
      setEnemySpecial,
      setBattleLocked,
      setBattleMessage,
      setCurrentHealth,
      setEnemyHealth: setCurrentEnemyHealth,
      setParalysisTurns,
      setBurnTurns,
      currentPower,
      currentDefense,
      currentHealth: turn.health,
      currentSpeed,
      currentHappiness,
      currentEnemyHealth,
      enemyInfo,
      alreadyPurchased,
      onTurnComplete: applyBurnAtTurnEnd,
      onComplete: (result) => {
        setBattleLocked(false);
        setBattleResult(result);
        setInCombat(false);
      },
      setDamageToEnemy,
      setDamageToPlayer,
      setSpecialCharge,
    });
  };

  // Handles the player's special attack action, including turn preparation and 
  // battle logic.
  const handleSpecial = () => {
    if (isLoading || battleLocked || !enemyInfo || currentEnemyHealth <= 0 || currentHealth <= 0
      || (specialCharge < 100 && paralysisTurns === 0)) {
      return;
    }

    const turn = preparePlayerTurn();
    if (!turn.canAct) return;

    setBattleLocked(true);
    setSpecialCharge(0);
    specialFunction({
      setPlayerSpecial,
      setEnemyAttack,
      setEnemySpecial,
      setBattleLocked,
      setBattleMessage,
      setCurrentHealth,
      setEnemyHealth: setCurrentEnemyHealth,
      setSpecialCharge,
      setDamageToEnemy,
      setDamageToPlayer,
      setParalysisTurns,
      setBurnTurns,
      currentPower,
      currentDefense,
      currentSpeed,
      currentHealth: turn.health,
      currentEnemyHealth,
      enemyInfo,
      alreadyPurchased,
      onTurnComplete: applyBurnAtTurnEnd,
      onComplete: (result) => {
        setBattleLocked(false);
        setBattleResult(result);
        setInCombat(false);
      },
    });
  };

  // Handles the player's escape action, including turn preparation and 
  // battle logic.
  const handleEscape = () => {
    if (isLoading || battleLocked || !enemyInfo || currentEnemyHealth <= 0 || currentHealth <= 0) {
      return;
    }

    const turn = preparePlayerTurn();
    if (!turn.canAct) return;

    escapeFunction({
      setPlayerRunning,
      setBattleLocked,
      setBattleMessage,
      setEnemyAttack,
      setEnemySpecial,
      setCurrentHealth,
      setDamageToPlayer,
      setSpecialCharge,
      setParalysisTurns,
      setBurnTurns,
      setCurrentEnergy,
      setCurrentHunger,
      setCurrentHappiness,
      currentSpeed,
      currentHealth: turn.health,
      currentDefense,
      enemyInfo,
      alreadyPurchased,
      difficultyLevel: selectedEnemyLevel,
      onEscapeSuccess: () => {
        setInCombat(false);
        setEscapeComplete(true);
      },
      onTurnComplete: applyBurnAtTurnEnd,
      onComplete: (result) => {
        setBattleLocked(false);
        setBattleResult(result);
        setInCombat(false);
      },
    });
  };

  // Effect to reset battle-related states and prepare for a new battle when 
  // the selected enemy level or activity changes.
  useEffect(() => {
    setParalysisTurns(0);
    setBurnTurns(0);
    setBurnDamageActive(false);
    if (burnDamageTimeout.current !== null) {
      window.clearTimeout(burnDamageTimeout.current);
      burnDamageTimeout.current = null;
    }
    if (activity === 'battle') {
      const nextEnemy = createEnemyForDifficulty(selectedEnemyLevel);
      setEnemyInfo(nextEnemy);
      setCurrentEnemyHealth(nextEnemy.health);
      setBattleMessage(DEFAULT_BATTLE_MESSAGE);
      setBattleResult(null);
      setBattleLocked(false);
      return;
    }

    setEnemyInfo(null);
    setCurrentEnemyHealth(0);
    setBattleResult(null);
    setBattleLocked(false);
  }, [selectedEnemyLevel, activity]);

  // Effect to reset the battle message after a certain duration if no battle '
  // result or escape has occurred.
  useEffect(() => {
    if (
      activity !== 'battle'
      || battleMessage === DEFAULT_BATTLE_MESSAGE
      || battleResult !== null
      || escapeComplete
    ) {
      return;
    }

    const resetMessage = window.setTimeout(() => {
      setBattleMessage(DEFAULT_BATTLE_MESSAGE);
    }, BATTLE_MESSAGE_DURATION);

    return () => window.clearTimeout(resetMessage);
  }, [activity, battleMessage, battleResult, escapeComplete]);

  // Effect to handle the battle result and update the player's status accordingly.
  useEffect(() => {
    if (battleResult !== null) {
      battleEndFunction(setCurrentStatus, setCurrentHunger, setCurrentEnergy, setCurrentPower, setCurrentDefense, setCurrentSpeed,
        setCurrentEndurance, setCurrentlyBusy, ()=>{}, setCurrentHappiness, setCurrentMoney, setBattlesWon, setMaxHealth, 
        setMaxEnergy, setCurrentHealth, setBattleMessage, setBattlesLost, chocoboName, selectedEnemyLevel, (battleResult === 'victory'), battlesWon
      );
    }
  }, [battleResult]);

  useEffect(() => {
    console.log('Battles lost: ', battlesLost);
  }, [battlesLost])

  useEffect(() => {
    let savedData: string | null;

    try {
      const autosavePreference = localStorage.getItem('digitalPetAutosaveEnabled');
      if (autosavePreference !== null) {
        setAutosaveEnabled(autosavePreference !== 'false');
      }

      savedData = localStorage.getItem('digitalPetSave');
    } catch (error) {
      reportSaveError('Unable to read browser storage. Existing progress could not be loaded, and changes may not be saved.', error, setSaveError);
      setStorageReadFailed(true);
      setStorageHydrated(true);
      return;
    }

    if (savedData) {
      try {
        const data = parseChocoboSaveData(JSON.parse(savedData) as unknown);

        setPlayerName(data.playerName);
        setChocoboName(data.chocoboName);
        setCurrentShellColor(data.currentShellColor);
        setRetroMode(data.retroMode);
        setIsMuted(data.isMuted);
        setCurrentHealth(data.currentHealth);
        setMaxHealth(data.maxHealth);
        setCurrentEnergy(data.currentEnergy);
        setMaxEnergy(data.maxEnergy);
        setCurrentHappiness(data.currentHappiness);
        setCurrentHunger(data.currentHunger);
        setCurrentPower(data.currentPower);
        setCurrentDefense(data.currentDefense);
        setCurrentSpeed(data.currentSpeed);
        setCurrentEndurance(data.currentEndurance);
        setCurrentMoodIcon(data.currentMoodIcon);
        setCurrentMoney(data.currentMoney);
        setAlreadyPurchased(data.alreadyPurchased);
        setBattlesWon(data.battlesWon);
        setBattlesLost(data.battlesLost);
        setRacesWon(data.racesWon);
        setSpecialCharge(data.specialCharge);
        setDataExists(true);
        setHideWelcome(true);
      } catch (error) {
        console.error('Unable to validate saved chocobo data:', error);
        setSaveRecoveryRequired(true);
        setSaveError('The saved game is invalid or damaged. Reset it to start a new game; the saved data has not been deleted.');
      }
    }

    setStorageHydrated(true);
  }, []);

  useEffect(() => {
    document.getElementById('DigipetRoot')?.classList.toggle('retro', retroMode);
  }, [retroMode]);

  // Effect to handle the autosave preference and save it to local storage.
  useEffect(() => {
    if (!storageHydrated) {
      return;
    }

    try {
      localStorage.setItem('digitalPetAutosaveEnabled', String(autosaveEnabled));
    } catch (error) {
      reportSaveError('Unable to save the autosave preference. Browser storage may be unavailable or full.', error, setSaveError);
    }
  }, [autosaveEnabled, storageHydrated]);

  // Effect to handle the autosave of game progress to local storage.
  useEffect(() => {
    if (!autosaveEnabled || !storageHydrated || storageReadFailed || saveRecoveryRequired || !hideWelcome || !playerName || !chocoboName) {
      return;
    }

    try {
      saveFunction(saveData);
      setSaveError(null);
    } catch (error) {
      reportSaveError('Unable to autosave game progress. Check browser storage availability and space.', error, setSaveError);
    }
  }, [
    alreadyPurchased,
    battlesWon,
    chocoboName,
    currentDefense,
    currentEndurance,
    currentEnergy,
    currentHappiness,
    currentHealth,
    currentMoodIcon,
    currentMoney,
    currentPower,
    currentShellColor,
    currentSpeed,
    currentStatus,
    currentHunger,
    hideWelcome,
    isMuted,
    maxEnergy,
    maxHealth,
    playerName,
    retroMode,
    racesWon,
    specialCharge,
    autosaveEnabled,
    storageHydrated,
    storageReadFailed,
    saveRecoveryRequired,
  ]);

  // Effect to handle the chocobo's status changes and trigger the appropriate 
  // actions.
  useEffect(() => {
    if (currentStatus === 'egg') {
      setCurrentlyBusy(true);
      return hatchingEvent(currentStatus, setCurrentStatus, setCurrentlyBusy);
    }
    if (currentStatus === 'eating') {
      return eatFunction(setCurrentStatus, setCurrentHunger, setCurrentHappiness, setCurrentEnergy, setCurrentHealth, setCurrentlyBusy,
        maxEnergy, maxHealth, alreadyPurchased
      );
    }
    if (currentStatus === 'sleeping') {
      return sleepingFunction(setCurrentStatus, setCurrentHunger, setCurrentEnergy, setCurrentHealth, setCurrentHappiness, setCurrentlyBusy,
        maxEnergy, maxHealth, alreadyPurchased
      );
    }
  }, [currentStatus, maxEnergy, maxHealth]);

  // Effect to handle the training action when an option is selected.
  useEffect(() => {
    if (optionSelected === 0) {
      return;
    }

    if (currentQuestionType !== 'training') {
        setOptionSelected(0);
        return;
    }

    let isEnded = false;
    let endTraining: (() => void) | undefined;
    setIsLoading(true);

    preloadGymBackground()
      .catch((error: unknown) => {
        console.error('Failed to load training background:', error);
      })
      .then(() => {
        if (isEnded) {
          return;
        }

        setIsLoading(false);
        endTraining = trainingFunction(setCurrentStatus, setCurrentHunger,
          setCurrentEnergy, setCurrentPower, setCurrentDefense, setCurrentSpeed,
          setCurrentEndurance, setCurrentlyBusy, setCurrentQuestionType, setQuestionWindowOpen,
          setCurrentHappiness, alreadyPurchased,
          optionSelected, () => setOptionSelected(0)
        );
      });

    return () => {
      isEnded = true;
      endTraining?.();
    };
  }, [currentQuestionType, optionSelected]);

  // When the chocobo's energy drops to zero, its happiness and health 
  // decreases randomly. Does not apply when energy value was already 0.
  // Both values are reduced by a random amount between 10 and 30.
  useEffect(() => {
    if (previousEnergy.current > 0 && currentEnergy === 0) {
      const happinessLoss = 10 + Math.floor(Math.random() * 20);
      const healthLoss = 10 + Math.floor(Math.random() * 20);
      setCurrentHappiness(prevHappiness => Math.max(prevHappiness - happinessLoss, VALUE_LIMITS.minHappiness));
      setCurrentHealth(prevHealth => prevHealth <= VALUE_LIMITS.minHP
        ? VALUE_LIMITS.minHP
        : Math.max(prevHealth - healthLoss, VALUE_LIMITS.minHP + 1));
    }
    previousEnergy.current = currentEnergy;
  }, [currentEnergy]);

  // Set mood & status based on current happiness level
  useEffect(() => {
    if (currentStatus !== 'egg') {
      if (currentHappiness >= 70) {
        setCurrentMoodIcon('happy');
        setCurrentStatus('happy');
      } else if (currentHappiness <= 30) {
        setCurrentMoodIcon('sad');
        setCurrentStatus('sad');
      } else {
        setCurrentMoodIcon('normal');
        setCurrentStatus('normal');
      }
    }
  }, [currentHappiness]);

  // If no saved data for the user exists, start the chocobo as an Egg.
  useEffect(() => {
    if (hideWelcome && !dataExists) {
      setCurrentStatus('egg');
    }

    // Following code prevents bug where user reloads page at 0 hp. Ensures that Chocobo is not
    // sitting at 0 hp and sets to 1 instead.
    if (dataExists && (currentHealth < 1)) {
      setCurrentHealth(1);
      setSpecialCharge(0);
    }
  }, [hideWelcome, dataExists]);

  return (
    <StartupPreloader>
      <ExternalUI currentTime={currentTime} setCurrentShellColor={setCurrentShellColor}
        retroMode={retroMode} setRetroMode={setRetroMode} isMuted={isMuted} 
        setIsMuted={setIsMuted} setCurrentTime={setCurrentTime}
        onSave={() => handleSave({ saveData, storageHydrated, storageReadFailed, saveRecoveryRequired, setSaveError })}
        onReset={() => handleReset(setSaveError)} autosaveEnabled={autosaveEnabled}
        setAutosaveEnabled={setAutosaveEnabled} />

      <div id='GameContainer' className={currentShellColor}>
        {saveError && !saveRecoveryRequired && (
          <div className='save-notice' role='alert'>
            {saveError}
          </div>
        )}
        <div className='top-panel'>
          {/* Welcome Form for when no game data present in storage */}
          {
            saveRecoveryRequired ? (
              <section className='save-recovery' role='alert'>
                <p>{saveError}</p>
                <button type='button' onClick={() => handleSaveRecovery(setSaveError)}>Reset save and start over</button>
              </section>
            ) : !hideWelcome &&
            <WelcomeForm welcomeMessage='Welcome! Are you ready to raise your very own Chocobo?' 
              question1='First, what is your name?' question2='What do you want to name your Chocobo?'
              val1={playerName} val2={chocoboName} setVal1={setPlayerName} setVal2={setChocoboName} 
              buttonTxt='OK' hideWelcomeForm={setHideWelcome}/>
          }

          {/* Main Game Display */}
          {
            !showMenuScreen && !questionWindowOpen && hideWelcome &&
            <GameDisplay 
              creatureName={chocoboName} inCombat={inCombat}
              alreadyPurchased={alreadyPurchased}
              currentStatus={currentStatus} currentHealth={currentHealth}
              battlesWon={battlesWon}
              maxHealth={maxHealth} currentHappiness={currentHappiness} 
              currentHunger={currentHunger}
              currentEnergy={currentEnergy} currentPower={currentPower}
              currentDefense={currentDefense} currentMoodIcon={currentMoodIcon}
              battleMessage={battleMessage}
              battleResult={battleResult}
              escapeComplete={escapeComplete}
              currentTime={currentTime} currentlyBusy={currentlyBusy}
              actionFailureTrigger={actionFailureTrigger}
              showMenuScreen={showMenuScreen} 
              activity={activity}
              onStartBattle={(level) => {
                setSelectedEnemyLevel(level);
                setIsLoading(true);
                setInCombat(true);
                setEscapeComplete(false);
                setActivity('battle');
              }}
              fishingInput={fishingInput}
              fishingEarnedCurrency={fishingEarnedCurrency}
              onFishingComplete={handleFishingComplete}
              onFishingClose={() => {
                setActivity('pet');
                setFishingComplete(false);
                setFishingInput(0);
                setCurrentlyBusy(false);
              }}
              raceDifficulty={raceDifficulty}
              raceEarnedCurrency={raceEarnedCurrency}
              currentSpeed={currentSpeed}
              currentEndurance={currentEndurance}
              raceSteeringInput={raceSteeringInput}
              sprintActive={sprintActive}
              setSprintActive={setSprintActive}
              onRaceComplete={handleRaceComplete}
              onRaceClose={() => {
                setActivity('pet');
                setRaceComplete(false);
                setSprintActive(false);
                setCurrentlyBusy(false);
              }}
              onSelectRaceDifficulty={(difficulty) => {
                setRaceDifficulty(difficulty);
                setRaceSteeringInput({ direction: 1, sequence: 0 });
                setRaceComplete(false);
                setSprintActive(false);
                setActivity('race');
              }}
              selectedEnemyLevel={selectedEnemyLevel}
              enemyId={enemyInfo?.id ?? null}
              isLoading={isLoading} setCurrentlyBusy={setCurrentlyBusy}
              setIsLoading={setIsLoading} 
              playerAttack={playerAttack} enemyAttack={enemyAttack} 
              playerSpecial={playerSpecial} enemySpecial={enemySpecial}
              enemySpecialType={enemyInfo?.specialAttack ?? 'power'}
              playerRunning={playerRunning}
              paralysisTurns={paralysisTurns} burnTurns={burnTurns}
              damageToEnemy={damageToEnemy} damageToPlayer={damageToPlayer}
              burnDamageActive={burnDamageActive}
              specialCharge={specialCharge}
            />
          }

          {/* Menu Screen w/several options (status, shop, achievements, info & tips) */}
          {
            showMenuScreen && !questionWindowOpen && !showStatusScreen && !showAchievementsScreen 
            && !showInfoScreen && !showShopScreen &&
              <MenuScreen currentStatus={currentStatus} />
          }

          {/* Status Screen that shows creature info */}
          {
            showStatusScreen && !questionWindowOpen &&
            <StatusScreen creatureName={chocoboName} currentStatus={currentStatus} 
              currentHealth={currentHealth} currentHappiness={currentHappiness} 
              currentMoodIcon={currentMoodIcon} currentHunger={currentHunger} 
              currentEnergy={currentEnergy} currentPower={currentPower} 
              currentDefense={currentDefense} currentSpeed={currentSpeed}
              currentEndurance={currentEndurance}
              maxHealth={maxHealth} maxEnergy={maxEnergy}
            />
          }

          {/* Shop Screen with in-game items */}
          {
            showShopScreen && !questionWindowOpen &&
            <ShopScreen currentStatus={currentStatus} currentMoney={currentMoney} 
              alreadyPurchased={alreadyPurchased} setCurrentMoney={setCurrentMoney} 
              setAlreadyPurchased={setAlreadyPurchased} 
              currentHealth={currentHealth} maxHealth={maxHealth}
              currentEnergy={currentEnergy} maxEnergy={maxEnergy} 
              setCurrentHealth={setCurrentHealth} setCurrentEnergy={setCurrentEnergy}
            />
          }

          {/* Achievements Screen that shows user's game accomplishments */}
          {
            showAchievementsScreen && !questionWindowOpen &&
            <AchievementScreen currentStatus={currentStatus} currentPower={currentPower} 
              currentDefense={currentDefense} currentSpeed={currentSpeed} 
              currentEndurance={currentEndurance} battlesWon={battlesWon}
              racesWon={racesWon}
            />
          }

          {/* Info Screen that explains the game and gives tips */}
          {
            showInfoScreen && !questionWindowOpen &&
            <InfoScreen currentStatus={currentStatus} />
          }
          
          {/* Window for displaying questions to the user */}
          {
            questionWindowOpen &&
            <>
              {
                currentQuestionType === 'training' &&
                <QuestionWindow dialogue='What Type of Training?' responsesArray={['Power', 'Defense', 'Speed', 'Endurance']} />
              }
              {
                currentQuestionType === 'play' &&
                <QuestionWindow dialogue='What To Play?' responsesArray={['Fishing', 'Chocobo Race', 'Battle']} />
              }
            </>
          }
        </div>

        {/* Bottom panel containing the main menu and game controls */}
        <div className='bottom-panel'>
          <Menu 
            activity={activity} onActivityChange={setActivity}
            inCombat={inCombat} currentStatus={currentStatus} currentHealth={currentHealth} maxHealth={maxHealth}
            onAttack={handleAttack} onSpecial={handleSpecial} onEscape={handleEscape} specialCharge={specialCharge}
            escapeComplete={escapeComplete}
            currentEnemyHealth={currentEnemyHealth}
            battleLocked={battleLocked}
            currentEnergy={currentEnergy} maxEnergy={maxEnergy} currentHunger={currentHunger}
            setCurrentStatus={setCurrentStatus} setShowStatusScreen={setShowStatusScreen}
            setActionFailureTrigger={setActionFailureTrigger}
            setCurrentlyBusy={setCurrentlyBusy} currentlyBusy={currentlyBusy}
            setOptionSelected={setOptionSelected} setQuestionWindowOpen={setQuestionWindowOpen}
            questionWindowOpen={questionWindowOpen} setCurrentQuestionType={setCurrentQuestionType}
            setFishingComplete={setFishingComplete}
            setFishingInput={setFishingInput}
            fishingComplete={fishingComplete}
            setRaceComplete={setRaceComplete}
            setSprintActive={setSprintActive}
            setRaceSteeringInput={setRaceSteeringInput}
            raceComplete={raceComplete}
            sprintActive={sprintActive}
            setShowMenuScreen={setShowMenuScreen} showMenuScreen={showMenuScreen}
            showStatusScreen={showStatusScreen} setInCombat={setInCombat}
            showShopScreen={showShopScreen} setShowShopScreen={setShowShopScreen}
            showAchievementsScreen={showAchievementsScreen}
            setShowAchievementsScreen={setShowAchievementsScreen}
            showInfoScreen={showInfoScreen} setShowInfoScreen={setShowInfoScreen}
            welcomeFormHidden={hideWelcome}
            playerAttack={playerAttack} enemyAttack={enemyAttack}
            playerSpecial={playerSpecial} enemySpecial={enemySpecial} playerRunning={playerRunning}
            setPlayerAttack={setPlayerAttack} setEnemyAttack={setEnemyAttack} 
            setPlayerSpecial={setPlayerSpecial} setEnemySpecial={setEnemySpecial} 
            setPlayerRunning={setPlayerRunning} setSpecialCharge={setSpecialCharge}
            isLoading={isLoading} setIsLoading={setIsLoading} 
            setCurrentHealth={setCurrentHealth} setCurrentEnergy={setCurrentEnergy}
          />
        </div>

      </div>
    </StartupPreloader>
  );
};

export default GameContainer;
