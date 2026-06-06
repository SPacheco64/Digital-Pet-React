import React, { useState } from 'react';
import { StatusDisplayProps } from './types';
import '../styles/components/status-display.scss';
import sadIcon from './graphics/icons/sad.svg';
import normalIcon from './graphics/icons/normal.svg';
import happyIcon from './graphics/icons/happy.svg';

const StatusDisplay: React.FC<StatusDisplayProps> = (props: StatusDisplayProps) => {
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

  const determineMood = () => {
    if (currentMoodIcon === 'happy') {
        return happyIcon;
    } else if (currentMoodIcon === 'sad') {
        return sadIcon;
    } else {
        return normalIcon;
    }
  }

  return (
    <div id='StatusDisplay'>
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
                Mood: 
                <span className='mood-icon'>
                    <img src={determineMood()} alt={'mood icon'} />
                </span>
            </div>
            <div className='hunger'>
                Hunger: {currentHunger}
            </div> 
            <div className='energy'>
                Energy: {currentEnergy}
            </div>
            {/* <div className='strength'>
                Strength: {currentStrength}
            </div>
            <div className='defense'>
                Defense: {currentDefense}
            </div> */}
        </div>
    </div>
  );
};

export default StatusDisplay;