import React, { useState } from 'react';
import { StatusWindowProps } from './types';
import '../styles/components/status-window.scss';
import { determineMood } from './helpers/MoodDeterminer';

const StatusWindow: React.FC<StatusWindowProps> = (props: StatusWindowProps) => {
  // Destructure props for ease of access & documentation
  const {
    creatureName,
    currentStatus,
    currentHealth,
    currentHappiness,
    currentMoodIcon,
    currentHunger,
    currentEnergy,
    currentStrength,
    currentDefense
  } = props;

  const isHappy = (currentHappiness >= 70);
  const isSad = (currentHappiness <=30);

  const determineMood = () => {
    if (isHappy) {
        return 'Happy';
    } else if (isSad) {
        return ('Sad');
    } else {
        return 'Neutral';
    }
  };

  return (
    <div id='StatusWindow'>
        <div className='name'>
            {creatureName}
        </div>
        <div className='status-details'>
            <div className='status'>
                Status: {currentStatus}
            </div>
            <div className='health'>
                Health: {currentHealth}
            </div>
            <div className='happiness'>
                Mood: {determineMood()}
            </div>
            <div className='hunger'>
                Hunger: {currentHunger}
            </div> 
            <div className='energy'>
                Energy: {currentEnergy}
            </div>
            <div className='strength'>
                Strength: {currentStrength}
            </div>
            <div className='defense'>
                Defense: {currentDefense}
            </div>
        </div>
    </div>
  );
};

export default StatusWindow;