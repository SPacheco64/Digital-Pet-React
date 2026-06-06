import React from 'react';
import { GameDisplayProps } from './types';
import Creature from './Creature';
import blueberries from './graphics/food_sprites/blueberries.png';
import '../styles/components/game-display.scss';

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
    currentStrength,
    currentDefense,
  } = props;

  return (
    <div id='GameDisplay'>
      {/* Displayed game content will go here */}
      {/* {
        (currentStatus === 'Eating') && (
          <div className='food-graphic'>
            <img src = {blueberries} alt = 'Food' /> 
          </div>  
        )
      }   */}
      <Creature currentStatus={currentStatus} creatureName={creatureName} />
    </div>
  );
};

export default GameDisplay;