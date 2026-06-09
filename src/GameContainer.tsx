import React, { useState, useEffect } from 'react';
import { GameContainerProps } from './types';
import GameDisplay from './GameDisplay';
import Menu from './Menu';
import '../styles/components/game-container.scss';
import StatusWindow from './StatusWindow';
import ImagePreloader from './helpers/components/ImagePreloader';
import ExternalUI from './ExternalUI';
import { eatFunction, hatchingEvent, trainingFunction, sleepingFunction } from './helpers/functions/OperationalFunctions';
import QuestionWindow from './helpers/components/QuestionWindow';

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
  const [currentStrength, setCurrentStrength] = useState<number>(1);
  const [currentDefense, setCurrentDefense] = useState<number>(1);
  const [showStatusWindow, setShowStatusWindow] = useState<boolean>(false);
  const [currentShellColor, setCurrentShellColor] = useState<string>('orange');
  const [currentlyBusy, setCurrentlyBusy] = useState<boolean>(false);

  const [questionWindowOpen, setQuestionWindowOpen] = useState<boolean>(false);
  const [currentQuestionType, setCurrentQuestionType] = useState<string>(''); // training, play
  const [optionSelected, setOptionSelected] = useState<number>(0);

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
          setCurrentEnergy, setCurrentStrength, setCurrentDefense, setCurrentlyBusy,
          setCurrentQuestionType, setQuestionWindowOpen, setCurrentHappiness, optionSelected
        );
        setOptionSelected(0);
        setCurrentQuestionType('');
      } else if (optionSelected === 2) {
        setCurrentStatus('training');
        trainingFunction(setCurrentStatus, setCurrentHunger, 
          setCurrentEnergy, setCurrentStrength, setCurrentDefense, setCurrentlyBusy,
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
    console.log('Current Strength: ', currentStrength);
    console.log('Current Defense: ', currentDefense);
  }, [currentStrength, currentDefense]);
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
  // ====================== FOR TESTING ======================

  return (
    <ImagePreloader>
      <ExternalUI setCurrentShellColor={setCurrentShellColor} setCurrentTime={setCurrentTime} />

      <div id='GameContainer' className={currentShellColor}>
        <div className='top-panel'>
          {/* Status Window that shows creature stats */}
          {
            showStatusWindow && !questionWindowOpen &&
            <StatusWindow creatureName={creatureName} currentStatus={currentStatus} 
              currentHealth={currentHealth} currentHappiness={currentHappiness} 
              currentMoodIcon={currentMoodIcon} currentHunger={currentHunger} 
              currentEnergy={currentEnergy} currentStrength={currentStrength} 
              currentDefense={currentDefense} 
            />
          }

          {/* Window for displaying questions to the user */}
          {
            questionWindowOpen &&
            <>
              {
                currentQuestionType === 'training' &&
                <QuestionWindow dialogue='What Type of Training?' responsesArray={['Strength', 'Defense']} />
              }
              {
                currentQuestionType === 'play' &&
                <QuestionWindow dialogue='What To Play?' responsesArray={['R.P.S', 'Guessing Game', 'Chocobo Race', 'Battle']} />
              }
            </>
          }

          {/* Main Game Display */}
          {
            !showStatusWindow && !questionWindowOpen &&
            <GameDisplay creatureName={creatureName} inCombat={inCombat} 
              currentStatus={currentStatus} currentHealth={currentHealth} 
              currentHappiness={currentHappiness} currentHunger={currentHunger} 
              currentEnergy={currentEnergy} currentStrength={currentStrength} 
              currentDefense={currentDefense} currentMoodIcon={currentMoodIcon} 
              currentTime={currentTime} 
              setCurrentlyBusy={setCurrentlyBusy} currentlyBusy={currentlyBusy}
            />
          }
        </div>

        <div className='bottom-panel'>
          <Menu 
            inCombat={inCombat} currentStatus={currentStatus} 
            showStatusWindow={showStatusWindow} setInCombat={setInCombat} 
            setCurrentStatus={setCurrentStatus} setShowStatusWindow={setShowStatusWindow}
            setCurrentlyBusy={setCurrentlyBusy} currentlyBusy={currentlyBusy}
            setOptionSelected={setOptionSelected} setQuestionWindowOpen={setQuestionWindowOpen}
            questionWindowOpen={questionWindowOpen} setCurrentQuestionType={setCurrentQuestionType}
          />
        </div>
      </div>
    </ImagePreloader>
  );
};

export default GameContainer;
