import React, { useState } from 'react';
import { BattleScreenProps } from '../types';
import '../../styles/components/battle-screen.scss';
import BattleCanvas from '../helpers/canvas/BattleCanvas';

const BattleScreen: React.FC<BattleScreenProps> = (props: BattleScreenProps) => {
  // Destructure props for ease of access & documentation
  const {
    // creatureName,
    // currentStatus,
    // currentHealth,
    // currentHappiness,
    // currentHunger,
    // currentEnergy,
    // currentPower,
    // currentDefense,
    // currentSpeed,
    // currentEndurance,
    isLoading,
    playerAttack,
    enemyAttack,
    playerSpecial,
    enemySpecial,
    playerRunning,
    setIsLoading
  } = props;

    // const isHappy = (currentHappiness >= 70);
    // const isSad = (currentHappiness <=30);
    // const powerCount = '★'.repeat(currentPower);
    // const defenseCount = '★'.repeat(currentDefense);
    // const speedCount = '★'.repeat(currentSpeed);
    // const enduranceCount = '★'.repeat(currentEndurance);

    // const statsArray = [
    //     {isStar: false, label: 'Mood: ', value: determineMood()},
    //     {isStar: false, label: 'Hunger: ', value: `${currentHunger}/100`},
    //     {isStar: false, label: 'Energy: ', value: `${currentEnergy}/100`},
    //     {isStar: false, label: 'Health: ', value: `${currentHealth}/100`},
    //     {isStar: true, label: 'POW:', value: powerCount},
    //     {isStar: true, label: 'DEF:', value: defenseCount},
    //     {isStar: true, label: 'SPD:', value: speedCount},
    //     {isStar: true, label: 'END:', value: enduranceCount},
    // ];

    return (
        <div id='BattleScreen' className='game-screen additional-screen'>
            <div className='battle-display'>
                <div className='message-box'>
                    What will you do?
                </div>
                <div className='choco-info'>
                    <div className='health'>
                        HP:<br/>
                        100/100
                    </div>
                    <div className='power'>
                        POW:<br/>
                        ★★★★★★★★★★
                    </div>
                    <div className='defense'>
                        DEF:<br/>
                        ★★★★★★★★★★
                    </div>
                </div>
            </div>

            <BattleCanvas selectedEnemyLevel={1} isLoading={isLoading} setIsLoading={setIsLoading} 
                playerAttack={playerAttack} enemyAttack={enemyAttack} 
                playerSpecial={playerSpecial} enemySpecial={enemySpecial} 
                playerRunning={playerRunning} 
            />
        </div>
    );
};

export default BattleScreen;