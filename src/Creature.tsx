import React from 'react';
import { CreatureProps } from './types';
import cactuarGif from './graphics/creature_sprites/Bouncing-Cactuar.gif';
import '../styles/components/creature-graphic.scss';

/*
Store info about the creature here, such as:
- Name
- Health
- Status (Egg, Healthy, Sick, Dead, etc.)
- Type of creature
- Any Other Stats

Render the Creature Graphic (Egg sprite, randomized creature sprite, etc.)
*/

const Creature: React.FC<CreatureProps> = (props: CreatureProps) => {
  // Destructure props for ease of access & documentation
  const {
    creatureName,
  } = props;

  return (
    <div id='Creature'>
      {/* Creature content will go here */}
      <div className='creature-graphic'>
        <img src={cactuarGif} alt={creatureName} />
      </div>
    </div>
  );
};

export default Creature;