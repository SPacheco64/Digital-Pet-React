import React from 'react';
import { CreatureProps } from './types';
import chocobo from './graphics/creature_sprites/chocobo_sprites/chocobo-normal.gif';
import chocoboEat from './graphics/creature_sprites/chocobo_sprites/chocobo-eating.gif';
import chocoboSleep from './graphics/creature_sprites/chocobo_sprites/chocobo-asleep.gif';
import chocoboTrain from './graphics/creature_sprites/chocobo_sprites/chocobo-training.gif';
import chocoboSad from './graphics/creature_sprites/chocobo_sprites/chocobo-upset.gif';
import eggGif from './graphics/creature_sprites/egg.gif';
import '../styles/components/creature-graphic.scss';
import { touchReaction } from './helpers/functions/TouchReaction';

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
    currentHappiness,
    creatureName,
    currentlyBusy,
    setCurrentlyBusy
  } = props;

  const determinePetState = () => {
    switch (currentStatus) {
      // case 'dead':
      //   return deadIcon;
      case 'eating':
        return chocoboEat;
      // case 'fighting':
      //   return fightingIcon;
      // case 'hurt':
      //   return hurtIcon;
      // case 'sick':
      //   return sickIcon;
      case 'sleeping':
        return chocoboSleep;
      // case 'tired':
      //   return tiredIcon;
      case 'training':
        return chocoboTrain;
      // case 'hungry':
      //     return hungryIcon;
      case 'sad':
        return chocoboSad;
      default:
        return chocobo;
    }
  }

  return (
    <div id='Creature'>
      {/* Creature content will go here */}
      <div className='creature-graphic'>
        {
          (currentStatus === 'Egg') ? (
            <img className='egg' src={eggGif} alt={'???'}
              onClick={() => touchReaction(currentHappiness, event, setCurrentlyBusy)} />
          ) : (
            <img src={determinePetState()} alt={creatureName} 
              onClick={() => {
                if (!currentlyBusy) { 
                  touchReaction(currentHappiness, event, setCurrentlyBusy); 
                }
              }
            } />
          )
        }
      </div>
    </div>
  );
};

export default Creature;