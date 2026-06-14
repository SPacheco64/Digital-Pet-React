import React, { useState } from 'react';
import { StatusScreenProps } from '../types';
import '../../styles/components/status-window.scss';
import eggIcon from '../graphics/creature_sprites/egg.gif';
import chocoIcon from '../graphics/creature_sprites/small_choco/choco-icon-run-2.gif';
import MenuCanvas from '../helpers/canvas/MenuCanvas';

const StatusScreen: React.FC<StatusScreenProps> = (props: StatusScreenProps) => {
  // Destructure props for ease of access & documentation
  const {
    creatureName,
    currentStatus,
    currentHealth,
    currentHappiness,
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

    const statsArray = [
        {isStar: false, label: 'Mood: ', value: determineMood()},
        {isStar: false, label: 'Hunger: ', value: `${currentHunger}/100`},
        {isStar: false, label: 'Energy: ', value: `${currentEnergy}/100`},
        {isStar: false, label: 'Health: ', value: `${currentHealth}/100`},
        {isStar: true, label: 'POW:', value: powerCount},
        {isStar: true, label: 'DEF:', value: defenseCount},
        {isStar: true, label: 'SPD:', value: speedCount},
        {isStar: true, label: 'END:', value: enduranceCount},
    ];

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
                    // If not currently an Egg, show the chocobo's stats
                    // Maps through stats array to show all values
                    (currentStatus !== 'Egg') &&
                    <>
                        {
                            statsArray.map((stat, index) => (
                                <>
                                    <div key={index}>
                                        <span>
                                            {stat.label}
                                        </span>
                                        <span className={`${stat.isStar ? 'star-value' : ''}`}>
                                            {stat.value}
                                        </span>
                                    </div>
                                </>
                            ))
                        }
                    </>
                }
            </div>

            <MenuCanvas currentStatus={currentStatus} iconToUse={1} />
        </div>
    );
};

export default StatusScreen;