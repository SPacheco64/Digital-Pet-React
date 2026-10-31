import React from 'react';
import { BattleMinigameProps } from '../../types';
import '../../../styles/components/battle-minigame.scss';
import BattleCanvas from '../canvas/BattleCanvas';

const BattleMinigame: React.FC<BattleMinigameProps> = (props: BattleMinigameProps) => {
    // Destructure props for ease of access & documentation
    const {
        selectedEnemyLevel,
        enemyId,
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
        enemySpecialType,
        playerRunning,
        paralysisTurns,
        burnTurns,
        escapeComplete,
        damageToEnemy,
        damageToPlayer,
        burnDamageActive,
        specialCharge,
        setIsLoading
    } = props;

    return (
        <div id='BattleMinigame' className='additional-screen'>
            <div className='battle-display'>
                <div className='message-box'>
                    {battleMessage}
                </div>
                <div className='choco-info'>
                    <div className='health'>
                        HP:<br/>
                        {currentHealth}/{maxHealth}
                    </div>
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
                (enemyAttack || enemySpecial || burnDamageActive) && damageToPlayer > 0 &&
                <div
                    key={`${burnDamageActive ? 'burn' : 'attack'}-${damageToPlayer}`}
                    className='damage-number to-player warning'
                >
                    {damageToPlayer}
                </div>
            }

            <BattleCanvas selectedEnemyLevel={selectedEnemyLevel} enemyId={enemyId} isLoading={isLoading} setIsLoading={setIsLoading}
                playerAttack={playerAttack} enemyAttack={enemyAttack} 
                playerSpecial={playerSpecial} enemySpecial={enemySpecial}
                enemySpecialType={enemySpecialType}
                playerRunning={playerRunning} paralysisTurns={paralysisTurns} burnTurns={burnTurns}
                escapeComplete={escapeComplete}
                battleResult={battleResult}
            />
        </div>
    );
};

export default BattleMinigame;