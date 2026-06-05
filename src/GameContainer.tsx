import React from 'react';
import { GameContainerProps } from './types';
import GameDisplay from './GameDisplay';
import Menu from './Menu';
import '../styles/components/game-container.scss';

const GameContainer: React.FC<GameContainerProps> = (props: GameContainerProps) => {
  // Destructure props for ease of access & documentation
  const {

  } = props;

  return (
    <div id='GameContainer'>
      <GameDisplay />
      
      <Menu />
    </div>
  );
};

export default GameContainer;
