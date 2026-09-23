import React, { useState, useEffect, useRef } from 'react';
import { ChocoboSaveData, GameContainerProps } from './types';
import GameDisplay from './GameDisplay';
import Menu from './Menu';
import '../styles/components/game-container.scss';
import ImagePreloader from './helpers/components/ImagePreloader';
import ExternalUI from './ExternalUI';
import { eatFunction, hatchingEvent, resetFunction, saveFunction, trainingFunction, sleepingFunction } from './helpers/functions/OperationalFunctions';
import QuestionWindow from './helpers/components/QuestionWindow';
import MenuScreen from './additional_screens/MenuScreen';
import StatusScreen from './additional_screens/StatusScreen';
import AchievementScreen from './additional_screens/AchievementScreen';
import InfoScreen from './additional_screens/InfoScreen';
import ShopScreen from './additional_screens/ShopScreen';
import WelcomeForm from './helpers/components/WelcomeForm';
import FishingMinigame from './helpers/components/FishingMinigame';
import RockPaperScissorsMinigame from './helpers/components/RockPaperScissorsMinigame';
import TestingPanel from './helpers/components/TestingPanel';

// Energy & Hunger changes after playing a minigame
const getPlayEnergyCost = () => 10 + Math.floor(Math.random() * 11);
const getPlayHungerGain = () => 5 + Math.floor(Math.random() * 11);

// Currency rewards for completing minigames
const getFishingReward = (caughtCount: number) => (
  Array.from({ length: caughtCount }, () => 3 + Math.floor(Math.random() * 3))
    .reduce((totalReward, reward) => totalReward + reward, 0)
);
const getRpsReward = () => 5 + Math.floor(Math.random() * 6);

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
  const [autosaveEnabled, setAutosaveEnabled] = useState<boolean>(() => (
    localStorage.getItem('digitalPetAutosaveEnabled') !== 'false'
  ));
  const [currentTime, setCurrentTime] = useState<string>('Day');
  const [currentShellColor, setCurrentShellColor] = useState<string>('orange');
  const [currentlyBusy, setCurrentlyBusy] = useState<boolean>(false);
  const [questionWindowOpen, setQuestionWindowOpen] = useState<boolean>(false);
  const [currentQuestionType, setCurrentQuestionType] = useState<string>(''); // training, play
  const [optionSelected, setOptionSelected] = useState<number>(0);
  const [showMenuScreen, setShowMenuScreen] = useState<boolean>(false);
  const [showBattleScreen, setShowBattleScreen] = useState<boolean>(false);
  const [showStatusScreen, setShowStatusScreen] = useState<boolean>(false);
  const [showShopScreen, setShowShopScreen] = useState<boolean>(false);
  const [showAchievementsScreen, setShowAchievementsScreen] = useState<boolean>(false);
  const [showInfoScreen, setShowInfoScreen] = useState<boolean>(false);
  const [inCombat, setInCombat] = useState<boolean>(false); // TO BE IMPLEMENTED LATER
  const [inPlay, setInPlay] = useState<boolean>(false); // TO BE IMPLEMENTED LATER
  const [battlesWon, setBattlesWon] = useState<number>(0); // TO BE IMPLEMENTED LATER
  const [racesWon, setRacesWon] = useState<number>(0); // TO BE IMPLEMENTED LATER
  const [currentMoney, setCurrentMoney] = useState<number>(0);
  const [alreadyPurchased, setAlreadyPurchased] = useState<Array<number>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fishingOpen, setFishingOpen] = useState<boolean>(false);
  const [fishingComplete, setFishingComplete] = useState<boolean>(false);
  const [fishingInput, setFishingInput] = useState<number>(0);
  const [fishingEarnedCurrency, setFishingEarnedCurrency] = useState<number>(0);
  const [rpsOpen, setRpsOpen] = useState<boolean>(false);
  const [rpsInput, setRpsInput] = useState<number>(0);
  const [rpsEarnedCurrency, setRpsEarnedCurrency] = useState<number>(0);

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
  const [previewAnimation, setPreviewAnimation] = useState<string>('auto');
  const [actionFailureTrigger, setActionFailureTrigger] = useState<number>(0);
  const previousEnergy = useRef<number>(currentEnergy);
  const hasHydratedSave = useRef<boolean>(false);

  // Battle State Values
  const [playerAttack, setPlayerAttack] = useState<boolean>(false);
  const [enemyAttack, setEnemyAttack] = useState<boolean>(false);
  const [playerSpecial, setPlayerSpecial] = useState<boolean>(false);
  const [enemySpecial, setEnemySpecial] = useState<boolean>(false);
  const [playerRunning, setPlayerRunning] = useState<boolean>(false);

  useEffect(() => {
    const savedData = localStorage.getItem('digitalPetSave');

    if (!savedData) {
      hasHydratedSave.current = true;
      return;
    }

    try {
      const data = JSON.parse(savedData) as ChocoboSaveData;

      if (!data.playerName || !data.chocoboName) {
        throw new Error('Saved chocobo data is missing required names.');
      }

      setPlayerName(data.playerName);
      setChocoboName(data.chocoboName);
      setCurrentShellColor(data.currentShellColor);
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
      setRacesWon(data.racesWon);
      setDataExists(true);
      setHideWelcome(true);
    } catch (error) {
      console.error('Unable to load saved chocobo data:', error);
      localStorage.removeItem('digitalPetSave');
    } finally {
      hasHydratedSave.current = true;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('digitalPetAutosaveEnabled', String(autosaveEnabled));
  }, [autosaveEnabled]);

  useEffect(() => {
    if (!autosaveEnabled || !hasHydratedSave.current || !hideWelcome || !playerName || !chocoboName) {
      return;
    }

    saveFunction({
      playerName,
      chocoboName,
      currentShellColor,
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
      racesWon,
    });
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
    maxEnergy,
    maxHealth,
    playerName,
    racesWon,
    autosaveEnabled,
  ]);

  const handleSave = () => {
    saveFunction({
      playerName,
      chocoboName,
      currentShellColor,
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
      racesWon,
    });
  };

  const handleReset = () => {
    if (resetFunction()) {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (currentStatus === 'Egg') {
      setCurrentlyBusy(true);
      hatchingEvent(currentStatus, setCurrentStatus, setCurrentlyBusy);
    }
    if (currentStatus === 'eating') {
      eatFunction(setCurrentStatus, setCurrentHunger, setCurrentHappiness, setCurrentEnergy, setCurrentHealth, setCurrentlyBusy);
    } else if (currentStatus === 'training') {
      // Training functionality currently handled externally
    } else if (currentStatus === 'sleeping') {
      sleepingFunction(setCurrentStatus, setCurrentHunger, setCurrentEnergy, setCurrentHealth, setCurrentHappiness, setCurrentlyBusy);
    }
  }, [currentStatus]);

  useEffect(() => {
    if (currentQuestionType === 'training') {
        trainingFunction(setCurrentStatus, setCurrentHunger, 
          setCurrentEnergy, setCurrentPower, setCurrentDefense, setCurrentSpeed,
          setCurrentEndurance, setCurrentlyBusy, setCurrentQuestionType, setQuestionWindowOpen,
          setCurrentHappiness, optionSelected
        );
        setOptionSelected(0);
        setCurrentQuestionType('');
    }
  }, [optionSelected]);

  // When the chocobo's energy drops to zero, its happiness and health 
  // decreases randomly. Does not apply when energy value was already 0.
  // Both values are reduced by a random amount between 10 and 20.
  useEffect(() => {
    if (previousEnergy.current > 0 && currentEnergy === 0) {
      const happinessLoss = 10 + Math.floor(Math.random() * 11);
      const healthLoss = 10 + Math.floor(Math.random() * 11);
      setCurrentHappiness(prevHappiness => Math.max(prevHappiness - happinessLoss, 0));
      setCurrentHealth(prevHealth => Math.max(prevHealth - healthLoss, 0)); 
    }
    previousEnergy.current = currentEnergy;
  }, [currentEnergy]);

  // Set mood & status based on current happiness level
  useEffect(() => {
    if (currentStatus !== 'Egg') {
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
      setCurrentStatus('Egg');
    }
  }, [hideWelcome, dataExists]);

  return (
    <ImagePreloader>
      <ExternalUI currentTime={currentTime} setCurrentShellColor={setCurrentShellColor} setCurrentTime={setCurrentTime}
        onSave={handleSave} onReset={handleReset} autosaveEnabled={autosaveEnabled}
        setAutosaveEnabled={setAutosaveEnabled} />

      <div id='GameContainer' className={currentShellColor}>
        <div className='top-panel'>
          {/* Welcome Form for when no game data present in storage */}
          {
            !hideWelcome &&
            <WelcomeForm welcomeMessage='Welcome! Are you ready to raise your very own Chocobo?' 
              question1='First, what is your name?' question2='What do you want to name your Chocobo?'
              val1={playerName} val2={chocoboName} setVal1={setPlayerName} setVal2={setChocoboName} 
              buttonTxt='OK' hideWelcomeForm={setHideWelcome}/>
          }

          {/* Main Game Display */}
          {
            !showMenuScreen && !questionWindowOpen && hideWelcome &&
            !fishingOpen && !rpsOpen &&
            <GameDisplay creatureName={chocoboName} inCombat={inCombat}
            currentStatus={currentStatus} currentHealth={currentHealth}
            currentHappiness={currentHappiness} currentHunger={currentHunger}
            currentEnergy={currentEnergy} currentPower={currentPower}
            currentDefense={currentDefense} currentMoodIcon={currentMoodIcon}
            currentTime={currentTime} currentlyBusy={currentlyBusy}
            actionFailureTrigger={actionFailureTrigger}
            previewAnimation={previewAnimation}
            showMenuScreen={showMenuScreen} showBattleScreen={showBattleScreen}
            isLoading={isLoading} setCurrentlyBusy={setCurrentlyBusy}
            setIsLoading={setIsLoading} 
            playerAttack={playerAttack} enemyAttack={enemyAttack} 
            playerSpecial={playerSpecial} enemySpecial={enemySpecial} 
            playerRunning={playerRunning}            
            />
          }

          {/* Fishing Minigame game screen */}
          {
            fishingOpen &&
            <FishingMinigame inputTrigger={fishingInput} earnedCurrency={fishingEarnedCurrency}
              onComplete={(caughtCount) => {
                const happinessChange = (caughtCount > 0) ? caughtCount * (3 + Math.floor(Math.random() * 6)) : -(5 + Math.floor(Math.random() * 6));
                const earnedCurrency = getFishingReward(caughtCount);
                setCurrentHappiness(prevHappiness => Math.min(prevHappiness + happinessChange, 100));
                setCurrentHunger(prevHunger => Math.min(prevHunger + getPlayHungerGain(), 100));
                setCurrentEnergy(prevEnergy => Math.max(prevEnergy - getPlayEnergyCost(), 0));
                setCurrentMoney(prevMoney => prevMoney + earnedCurrency);
                setFishingEarnedCurrency(earnedCurrency);
                setFishingComplete(true);
              }}
              onClose={() => {
                setFishingOpen(false);
                setFishingComplete(false);
                setFishingInput(0);
                setCurrentlyBusy(false);
              }}
            />
          }

          {/* Rock Paper Scissors Minigame game screen */}
          {
            rpsOpen &&
            <RockPaperScissorsMinigame inputTrigger={rpsInput} earnedCurrency={rpsEarnedCurrency}
              onResult={(result) => {
                const happinessChange = result === 'win'
                  ? 10 + Math.floor(Math.random() * 6)
                  : result === 'tie'
                    ? 5 + Math.floor(Math.random() * 4)
                    : 2 + Math.floor(Math.random() * 4);
                const earnedCurrency = result === 'win' ? getRpsReward() : 0;

                setCurrentHappiness(prevHappiness => Math.min(prevHappiness + happinessChange, 100));
                setCurrentHunger(prevHunger => Math.min(prevHunger + getPlayHungerGain(), 100));
                setCurrentEnergy(prevEnergy => Math.max(prevEnergy - getPlayEnergyCost(), 0));
                setCurrentMoney(prevMoney => prevMoney + earnedCurrency);
                setRpsEarnedCurrency(earnedCurrency);
              }}
              onComplete={() => {
                setRpsOpen(false);
                setRpsInput(0);
                setCurrentlyBusy(false);
              }} />
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
            />
          }

          {/* Shop Screen with in-game items */}
          {
            showShopScreen && !questionWindowOpen &&
            <ShopScreen currentStatus={currentStatus} currentMoney={currentMoney} 
              alreadyPurchased={alreadyPurchased} setCurrentMoney={setCurrentMoney} 
              setAlreadyPurchased={setAlreadyPurchased}  
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
                <QuestionWindow dialogue='What To Play?' responsesArray={['R.P.S', 'Fishing', 'Chocobo Race', 'Battle']} />
              }
            </>
          }
        </div>

        {/* Bottom panel containing the main menu and game controls */}
        <div className='bottom-panel'>
          <Menu 
            inCombat={inCombat} currentStatus={currentStatus} currentHealth={currentHealth} maxHealth={maxHealth}
            currentEnergy={currentEnergy} maxEnergy={maxEnergy} currentHunger={currentHunger}
            setCurrentStatus={setCurrentStatus} setShowStatusScreen={setShowStatusScreen}
            setActionFailureTrigger={setActionFailureTrigger}
            setCurrentlyBusy={setCurrentlyBusy} currentlyBusy={currentlyBusy}
            setOptionSelected={setOptionSelected} setQuestionWindowOpen={setQuestionWindowOpen}
            questionWindowOpen={questionWindowOpen} setCurrentQuestionType={setCurrentQuestionType}
            setFishingOpen={setFishingOpen}
            setFishingComplete={setFishingComplete}
            setFishingInput={setFishingInput}
            fishingOpen={fishingOpen}
            fishingComplete={fishingComplete}
            setRpsOpen={setRpsOpen}
            setRpsInput={setRpsInput}
            rpsOpen={rpsOpen}
            setShowMenuScreen={setShowMenuScreen} showMenuScreen={showMenuScreen}
            showStatusScreen={showStatusScreen} setInCombat={setInCombat}
            showShopScreen={showShopScreen} setShowShopScreen={setShowShopScreen}
            showAchievementsScreen={showAchievementsScreen}
            setShowAchievementsScreen={setShowAchievementsScreen}
            showInfoScreen={showInfoScreen} setShowInfoScreen={setShowInfoScreen}
            welcomeFormHidden={hideWelcome}
            showBattleScreen={showBattleScreen} setShowBattleScreen={setShowBattleScreen} 
            playerAttack={playerAttack} enemyAttack={enemyAttack}
            playerSpecial={playerSpecial} enemySpecial={enemySpecial} playerRunning={playerRunning}
            setPlayerAttack={setPlayerAttack} setEnemyAttack={setEnemyAttack} 
            setPlayerSpecial={setPlayerSpecial} setEnemySpecial={setEnemySpecial} 
            setPlayerRunning={setPlayerRunning}            
          />
        </div>

        {/* Testing panel for adjusting chocobo stats */}
        <TestingPanel
          chocoboName={chocoboName}
          currentStatus={currentStatus}
          currentMoney={currentMoney}
          currentTime={currentTime}
          currentHealth={currentHealth}
          maxHealth={maxHealth}
          currentEnergy={currentEnergy}
          maxEnergy={maxEnergy}
          currentHappiness={currentHappiness}
          currentHunger={currentHunger}
          currentPower={currentPower}
          currentDefense={currentDefense}
          currentSpeed={currentSpeed}
          currentEndurance={currentEndurance}
          previewAnimation={previewAnimation}
          setChocoboName={setChocoboName}
          setCurrentStatus={setCurrentStatus}
          setCurrentMoney={setCurrentMoney}
          setCurrentTime={setCurrentTime}
          setCurrentHealth={setCurrentHealth}
          setMaxHealth={setMaxHealth}
          setCurrentEnergy={setCurrentEnergy}
          setMaxEnergy={setMaxEnergy}
          setCurrentHappiness={setCurrentHappiness}
          setCurrentHunger={setCurrentHunger}
          setCurrentPower={setCurrentPower}
          setCurrentDefense={setCurrentDefense}
          setCurrentSpeed={setCurrentSpeed}
          setCurrentEndurance={setCurrentEndurance}
          setPreviewAnimation={setPreviewAnimation}
        />
      </div>
    </ImagePreloader>
  );
};

export default GameContainer;
