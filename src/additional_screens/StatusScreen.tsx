import React, { useState } from 'react';
import { StatusScreenProps } from '../types';
import '../../styles/components/status-window.scss';
import eggIcon from '../graphics/creature_sprites/egg.gif';
import chocoIcon from '../graphics/creature_sprites/small_choco/choco-icon-run-2.gif';

const StatusScreen: React.FC<StatusScreenProps> = (props: StatusScreenProps) => {
  // Destructure props for ease of access & documentation
  const {
    creatureName,
    currentStatus,
    currentHealth,
    currentHappiness,
    currentMoodIcon,
    currentHunger,
    currentEnergy,
    currentPower,
    currentDefense,
    currentSpeed,
    currentEndurance,
  } = props;

    const isHappy = (currentHappiness >= 70);
    const isSad = (currentHappiness <=30);
    const powerCount = '★'.repeat(currentPower);
    const defenseCount = '★'.repeat(currentDefense);
    const speedCount = '★'.repeat(currentSpeed);
    const enduranceCount = '★'.repeat(currentEndurance);

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
        <div id='StatusScreen' className='game-screen additional-screen'>
            <div className='name'>
                {creatureName}
            </div>
            <div className='status-details'>
                <div className='status'>
                    Status: {(currentStatus === 'happy' || currentStatus === 'sad') ? 'normal' : currentStatus}
                </div>
                {
                    currentStatus !== 'Egg' &&
                    <>
                        <div className='happiness'>
                            Mood: {determineMood()}
                        </div>
                        <div className='hunger'>
                            Hunger: {currentHunger}/100
                        </div> 
                        <div className='energy'>
                            Energy: {currentEnergy}/100
                        </div>
                        <div className='health'>
                            Health: {currentHealth}/100
                        </div>
                        <div className='power'>
                            <span className='label'>POW:</span>
                            <span className='star-value'>{powerCount}</span>
                        </div>
                        <div className='defense'>
                            <span className='label'>DEF:</span>
                            <span className='star-value'>{defenseCount}</span>
                        </div>
                        <div className='speed'>
                            <span className='label'>SPD:</span>
                            <span className='star-value'>{speedCount}</span>
                        </div>
                        <div className='endurance'>
                            <span className='label'>END:</span>
                            <span className='star-value'>{enduranceCount}</span>
                        </div>
                    </>
                }
                <div className='choco-icon'>
                    <img src={currentStatus === 'Egg' ? eggIcon : chocoIcon} />
                </div>
            </div>
        </div>
    );
};

export default StatusScreen;