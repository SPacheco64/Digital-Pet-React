import React from 'react';
import { CreatureProps } from './types';
import chocobo from './graphics/creature_sprites/chocobo_sprites/chocobo-normal.gif';
import chocoboEat from './graphics/creature_sprites/chocobo_sprites/chocobo-eating.gif';
import chocoboSleep from './graphics/creature_sprites/chocobo_sprites/chocobo-sleeping.gif';
import eggGif from './graphics/creature_sprites/egg.gif';
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
    currentStatus,
    creatureName,
  } = props;

  return (
    <div id='Creature'>
      {/* Creature content will go here */}
      <div className='creature-graphic'>
        {
          (currentStatus === 'Egg') ? (
            <img src={eggGif} alt={creatureName} />
          ) : (
            (currentStatus === 'Eating') ? (
              <img src={chocoboEat} alt={creatureName} />
            ) : (
              <img src={chocobo} alt={creatureName} />
            )
          )
        }
      </div>
    </div>
  );
};

export default Creature;