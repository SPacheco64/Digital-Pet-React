import React, { useState } from 'react';
import { BattleScreenProps } from '../types';
import '../../styles/components/battle-screen.scss';
import BattleCanvas from '../helpers/canvas/BattleCanvas';

const BattleScreen: React.FC<BattleScreenProps> = (props: BattleScreenProps) => {
  // Destructure props for ease of access & documentation
  const {
    selectedEnemyLevel,
    currentHealth,
    maxHealth,
    currentPower,
    currentDefense,
    battleMessage,
    battleResult,
    isLoading,
    playerAttack,
    enemyAttack,
    playerSpecial,
    enemySpecial,
    playerRunning,
    damageToEnemy,
    damageToPlayer,
    specialCharge,
    setIsLoading
  } = props;

    const powerCount = '★'.repeat(currentPower);
    const defenseCount = '★'.repeat(currentDefense);

    return (
        <div id='BattleScreen' className='game-screen additional-screen'>
            <div className='battle-display'>
                <div className='message-box'>
                    {battleMessage}
                </div>
                <div className='choco-info'>
                    <div className='health'>
                        HP:<br/>
                        {currentHealth}/{maxHealth}
                    </div>
                    {/* <div className='power'>
                        POW:<br/>
                        {powerCount}
                    </div>
                    <div className='defense'>
                        DEF:<br/>
                        {defenseCount}
                    </div> */}
                    <div className='special-meter' aria-label={`Special charge ${specialCharge}%`}>
                        <div className='special-meter-label'>LIMIT</div>
                        <div className='special-meter-track' role='progressbar' aria-valuenow={specialCharge} aria-valuemin={0} aria-valuemax={100}>
                            <div className={`special-meter-fill${specialCharge >= 100 ? ' charged' : ''}`} style={{ width: `${specialCharge}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Damage values that show on attack */}
            {
                (playerAttack || playerSpecial) && damageToEnemy > 0 &&
                <div className='damage-number to-enemy warning'> {damageToEnemy} </div>
            }
            {
                enemyAttack && damageToPlayer &&
                <div className='damage-number to-player warning'> {damageToPlayer} </div>
            }

            <BattleCanvas selectedEnemyLevel={selectedEnemyLevel} isLoading={isLoading} setIsLoading={setIsLoading} 
                playerAttack={playerAttack} enemyAttack={enemyAttack} 
                playerSpecial={playerSpecial} enemySpecial={enemySpecial} 
                playerRunning={playerRunning} 
                battleResult={battleResult}
            />
        </div>
    );
};

export default BattleScreen;