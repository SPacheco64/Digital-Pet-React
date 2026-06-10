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

const GameContainer: React.FC<GameContainerProps> = (props: GameContainerProps) => {
  // Destructure props for ease of access & documentation
  const {

  } = props;

  // State variables for game status and creature attributes
  const [currentTime, setCurrentTime] = useState<string>('Day');
  const [creatureName, setCreatureName] = useState<string>('???');
  const [inCombat, setInCombat] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<string>('Egg');
  const [currentHealth, setCurrentHealth] = useState<number>(100);
  const [currentHappiness, setCurrentHappiness] = useState<number>(50);
  const [currentMoodIcon, setCurrentMoodIcon] = useState<string>('Normal');
  const [currentHunger, setCurrentHunger] = useState<number>(50);
  const [currentEnergy, setCurrentEnergy] = useState<number>(100);
  const [currentPower, setCurrentPower] = useState<number>(1);
  const [currentDefense, setCurrentDefense] = useState<number>(1);
  const [currentSpeed, setCurrentSpeed] = useState<number>(1); // TO BE IMPLEMENTED LATER
  const [currentEndurance, setCurrentEndurance] = useState<number>(1); // TO BE IMPLEMENTED LATER
  const [currentShellColor, setCurrentShellColor] = useState<string>('orange');
  const [currentlyBusy, setCurrentlyBusy] = useState<boolean>(false);
  const [battlesWon, setBattlesWon] = useState<number>(0); // TO BE IMPLEMENTED LATER
  const [racesWon, setRacesWon] = useState<number>(0); // TO BE IMPLEMENTED LATER

  const [questionWindowOpen, setQuestionWindowOpen] = useState<boolean>(false);
  const [currentQuestionType, setCurrentQuestionType] = useState<string>(''); // training, play
  const [optionSelected, setOptionSelected] = useState<number>(0);

  const [showMenuScreen, setShowMenuScreen] = useState<boolean>(false);
  const [showStatusScreen, setShowStatusScreen] = useState<boolean>(false);
  const [showAchievementsScreen, setShowAchievementsScreen] = useState<boolean>(false);
  const [showInfoScreen, setInfoScreen] = useState<boolean>(false);

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
      if (optionSelected === 1) {
        setCurrentStatus('training');
        trainingFunction(setCurrentStatus, setCurrentHunger, 
          setCurrentEnergy, setCurrentPower, setCurrentDefense, setCurrentlyBusy,
          setCurrentQuestionType, setQuestionWindowOpen, setCurrentHappiness, optionSelected
        );
        setOptionSelected(0);
        setCurrentQuestionType('');
      } else if (optionSelected === 2) {
        setCurrentStatus('training');
        trainingFunction(setCurrentStatus, setCurrentHunger, 
          setCurrentEnergy, setCurrentPower, setCurrentDefense, setCurrentlyBusy,
          setCurrentQuestionType, setQuestionWindowOpen, setCurrentHappiness, 
          optionSelected
        );
        setOptionSelected(0);
        setCurrentQuestionType('');
      }
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

  // ====================== FOR TESTING ======================
  useEffect(() => {
    console.log('Current Power: ', currentPower);
    console.log('Current Defense: ', currentDefense);
  }, [currentPower, currentDefense]);
  useEffect(()=> {
    console.log('Current Energy: ', currentEnergy, '/100');
  }, [currentEnergy]);
  useEffect(() => {
    console.log('Current Status: ', currentStatus);
  }, [currentStatus]);
  useEffect(()=> {
    console.log('Current Happiness: ', currentHappiness, '/100');
  }, [currentHappiness]);
  useEffect(()=> {
    console.log('Current Hunger: ', currentHunger, '/100');
  }, [currentHunger]);
  useEffect(() => {
    console.log('Current Health: ', currentHealth, '/100');
  }, [currentHealth]);
  useEffect(() => {
    console.log('Current Question Type: ', currentQuestionType);
  }, [currentQuestionType]);
  useEffect(() => {
    console.log('Currently Busy?: ', currentlyBusy);
  }, [currentlyBusy]);
  useEffect(() => {
    console.log('Show Menu Screen?: ', showMenuScreen);
  }, [showMenuScreen]);
    useEffect(() => {
    console.log('Show Status Screen?: ', showStatusScreen);
  }, [showStatusScreen]);
  // ====================== FOR TESTING ======================

  return (
    <ImagePreloader>
      <ExternalUI setCurrentShellColor={setCurrentShellColor} setCurrentTime={setCurrentTime} />

      <div id='GameContainer' className={currentShellColor}>
        <div className='top-panel'>
          {/* Status Window that shows creature stats */}
          {
            showMenuScreen && !questionWindowOpen && !showStatusScreen && !showAchievementsScreen &&
              <MenuScreen currentStatus={currentStatus} />
          }

          {
            showStatusScreen && !questionWindowOpen &&
            <StatusScreen creatureName={creatureName} currentStatus={currentStatus} 
              currentHealth={currentHealth} currentHappiness={currentHappiness} 
              currentMoodIcon={currentMoodIcon} currentHunger={currentHunger} 
              currentEnergy={currentEnergy} currentPower={currentPower} 
              currentDefense={currentDefense} 
            />
          }

          {
            showAchievementsScreen && !questionWindowOpen &&
            <AchievementScreen currentStatus={currentStatus} currentPower={currentPower} 
              currentDefense={currentDefense} currentSpeed={currentSpeed} 
              currentEndurance={currentEndurance} battlesWon={battlesWon}
              racesWon={racesWon}
            />
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

          {/* Main Game Display */}
          {
            !showMenuScreen && !questionWindowOpen &&
            <GameDisplay creatureName={creatureName} inCombat={inCombat} 
              currentStatus={currentStatus} currentHealth={currentHealth} 
              currentHappiness={currentHappiness} currentHunger={currentHunger} 
              currentEnergy={currentEnergy} currentPower={currentPower} 
              currentDefense={currentDefense} currentMoodIcon={currentMoodIcon} 
              currentTime={currentTime} 
              setCurrentlyBusy={setCurrentlyBusy} currentlyBusy={currentlyBusy}
            />
          }
        </div>

        <div className='bottom-panel'>
          <Menu 
            inCombat={inCombat} currentStatus={currentStatus} 
            showStatusScreen={showStatusScreen} setInCombat={setInCombat} 
            setCurrentStatus={setCurrentStatus} setShowStatusScreen={setShowStatusScreen}
            setCurrentlyBusy={setCurrentlyBusy} currentlyBusy={currentlyBusy}
            setOptionSelected={setOptionSelected} setQuestionWindowOpen={setQuestionWindowOpen}
            questionWindowOpen={questionWindowOpen} setCurrentQuestionType={setCurrentQuestionType}
            setShowMenuScreen={setShowMenuScreen} showMenuScreen={showMenuScreen}
            showAchievementsScreen={showAchievementsScreen} 
            setShowAchievementsScreen={setShowAchievementsScreen}
          />
        </div>
      </div>
    </ImagePreloader>
  );
};

export default GameContainer;
