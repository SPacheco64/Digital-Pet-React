import React, { useState, useEffect } from 'react';
import { GameContainerProps } from './types';
import GameDisplay from './GameDisplay';
import Menu from './Menu';
import '../styles/components/game-container.scss';
import ImagePreloader from './helpers/components/ImagePreloader';
import ExternalUI from './ExternalUI';
import { eatFunction, hatchingEvent, trainingFunction, sleepingFunction } from './helpers/functions/OperationalFunctions';
import QuestionWindow from './helpers/components/QuestionWindow';
import MenuScreen from './additional_screens/MenuScreen';
import StatusScreen from './additional_screens/StatusScreen';
import AchievementScreen from './additional_screens/AchievementScreen';
import InfoScreen from './additional_screens/InfoScreen';
import ShopScreen from './additional_screens/ShopScreen';
import MenuCanvas from './helpers/canvas/MenuCanvas';

const GameContainer: React.FC<GameContainerProps> = (props: GameContainerProps) => {
  // Destructure props for ease of access & documentation
  const {

  } = props;

  // State variables for game status
  const [currentTime, setCurrentTime] = useState<string>('Day');
  const [currentShellColor, setCurrentShellColor] = useState<string>('orange');
  const [currentlyBusy, setCurrentlyBusy] = useState<boolean>(false);
  const [questionWindowOpen, setQuestionWindowOpen] = useState<boolean>(false);
  const [currentQuestionType, setCurrentQuestionType] = useState<string>(''); // training, play
  const [optionSelected, setOptionSelected] = useState<number>(0);
  const [showMenuScreen, setShowMenuScreen] = useState<boolean>(false);
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

  // State Values for Creature Information
  const [creatureName, setCreatureName] = useState<string>('???');
  const [currentStatus, setCurrentStatus] = useState<string>('Egg');
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

  useEffect(() => {
    if (currentStatus === 'Egg') {
      setCurrentlyBusy(true);
      hatchingEvent(currentStatus, setCreatureName, setCurrentStatus, setCurrentlyBusy);
    }
    if (currentStatus === 'eating') {
      eatFunction(setCurrentStatus, setCurrentHunger, setCurrentHappiness, setCurrentEnergy, setCurrentlyBusy);
    } else if (currentStatus === 'training') {
      // Training functionality currently handled externally
    } else if (currentStatus === 'sleeping') {
      sleepingFunction(setCurrentStatus, setCurrentHunger, setCurrentEnergy, setCurrentHappiness, setCurrentlyBusy);
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

  return (
    <ImagePreloader>
      <ExternalUI setCurrentShellColor={setCurrentShellColor} setCurrentTime={setCurrentTime} />

      <div id='GameContainer' className={currentShellColor}>
        <div className='top-panel'>
          {/* Main Game Display */}
          {
            !showMenuScreen && !questionWindowOpen &&
            <GameDisplay creatureName={creatureName} inCombat={inCombat} 
              currentStatus={currentStatus} currentHealth={currentHealth} 
              currentHappiness={currentHappiness} currentHunger={currentHunger} 
              currentEnergy={currentEnergy} currentPower={currentPower} 
              currentDefense={currentDefense} currentMoodIcon={currentMoodIcon} 
              currentTime={currentTime} currentlyBusy={currentlyBusy}
              showMenuScreen={showMenuScreen} setCurrentlyBusy={setCurrentlyBusy}
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
            <StatusScreen creatureName={creatureName} currentStatus={currentStatus} 
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
                <QuestionWindow dialogue='What To Play?' responsesArray={['R.P.S', 'Guessing Game', 'Chocobo Race', 'Battle']} />
              }
            </>
          }
        </div>

        <div className='bottom-panel'>
          <Menu 
            inCombat={inCombat} currentStatus={currentStatus} 
            setCurrentStatus={setCurrentStatus} setShowStatusScreen={setShowStatusScreen}
            setCurrentlyBusy={setCurrentlyBusy} currentlyBusy={currentlyBusy}
            setOptionSelected={setOptionSelected} setQuestionWindowOpen={setQuestionWindowOpen}
            questionWindowOpen={questionWindowOpen} setCurrentQuestionType={setCurrentQuestionType}
            setShowMenuScreen={setShowMenuScreen} showMenuScreen={showMenuScreen}
            showStatusScreen={showStatusScreen} setInCombat={setInCombat} 
            showShopScreen={showShopScreen} setShowShopScreen={setShowShopScreen}
            showAchievementsScreen={showAchievementsScreen} 
            setShowAchievementsScreen={setShowAchievementsScreen}
            showInfoScreen={showInfoScreen} setShowInfoScreen={setShowInfoScreen}
          />
        </div>
      </div>
    </ImagePreloader>
  );
};

export default GameContainer;
