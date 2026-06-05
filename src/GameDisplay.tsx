import React from 'react';
import { GameDisplayProps } from './types';
import Creature from './Creature';

const GameDisplay: React.FC<GameDisplayProps> = (props: GameDisplayProps) => {
  // Destructure props for ease of access & documentation
  const {

  } = props;

  return (
    <div id='GameDisplay'>
      {/* Displayed game content will go here */}
      <span>Oh wow I am a game display and here is your creature!</span>
      <Creature creatureName='Cactuar' />
    </div>
  );
};

export default GameDisplay;