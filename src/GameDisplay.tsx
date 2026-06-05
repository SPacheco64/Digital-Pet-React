import React from 'react';
import { GameDisplayProps } from './types';

const GameDisplay: React.FC<GameDisplayProps> = (props: GameDisplayProps) => {
  // Destructure props for ease of access & documentation
  const {

  } = props;

  return (
    <div id='GameDisplay'>
      {/* Displayed game content will go here */}
      <span>Oh wow I am a game display</span>
    </div>
  );
};

export default GameDisplay;