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
  const strengthCount = '★'.repeat(currentStrength);
  const defenseCount = '★'.repeat(currentDefense);

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
            <div className='happiness'>
                Mood: {determineMood()}
            </div>
            <div className='hunger'>
                Hunger: {currentHunger}
            </div> 
            <div className='energy'>
                Energy: {currentEnergy}
            </div>
            <div className='health'>
                Health: {currentHealth}
            </div>
            <div className='strength'>
                <span className='label'>Strength:</span>
                <span className='star-value'>{strengthCount}</span>
            </div>
            <div className='defense'>
                <span className='label'>Defense:</span>
                <span className='star-value'>{defenseCount}</span>
            </div>
        </div>
    </div>
  );
};

export default StatusWindow;