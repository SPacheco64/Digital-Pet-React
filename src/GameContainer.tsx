import React, { useState, useEffect } from 'react';
import { GameContainerProps } from './types';
import GameDisplay from './GameDisplay';
import Menu from './Menu';
import '../styles/components/game-container.scss';
import StatusDisplay from './StatusDisplay';
import ImagePreloader from './helpers/ImagePreloader';

const GameContainer: React.FC<GameContainerProps> = (props: GameContainerProps) => {
  // Destructure props for ease of access & documentation
  const {

  } = props;

  // State variables for game status and creature attributes
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

  useEffect(() => {
    const hatchingEvent = setTimeout(() => {
      if (currentStatus === 'Egg') {
        setCreatureName('Choco');
        setCurrentStatus('Normal');
      }
    }, 10000);

    if (currentStatus === 'Eating') {
      const eatingTimer = setTimeout(() => {
        setCurrentStatus('Normal');
        setCurrentHunger(prevHunger => Math.max(prevHunger - 20, 0)); // Decrease hunger by 20, but not below 0
        setCurrentHappiness(prevHappiness => Math.min(prevHappiness + 10, 100)); // Increase happiness by 10, but not above 100
      }, 5000);

      return () => clearTimeout(eatingTimer);
    }

    return () => clearTimeout(hatchingEvent);
  }, [currentStatus]);

  useEffect(() => {
    if (currentHappiness >= 70) {
      setCurrentMoodIcon('happy');
    } else if (currentHappiness <= 30) {
      setCurrentMoodIcon('sad');
    } else {
      setCurrentMoodIcon('normal');
    }
  }, [currentHappiness]);



  return (
    <ImagePreloader>
      <div id='GameContainer'>
        <div className='top-panel'>
          <GameDisplay creatureName={creatureName} inCombat={inCombat} currentStatus={currentStatus} 
            currentHealth={currentHealth} currentHappiness={currentHappiness} 
            currentHunger={currentHunger} currentEnergy={currentEnergy} 
            currentStrength={currentStrength} currentDefense={currentDefense} 
          />
        </div>
        <div className='bottom-panel'>
          <StatusDisplay creatureName={creatureName} currentStatus={currentStatus} 
            currentHealth={currentHealth} currentHappiness={currentHappiness} 
            currentMoodIcon={currentMoodIcon} currentHunger={currentHunger} 
            currentEnergy={currentEnergy} currentStrength={currentStrength} 
            currentDefense={currentDefense} 
          />

          <Menu inCombat={inCombat} setInCombat={setInCombat} setCurrentStatus={setCurrentStatus} />
        </div>
      </div>
    </ImagePreloader>
  );
};

export default GameContainer;
