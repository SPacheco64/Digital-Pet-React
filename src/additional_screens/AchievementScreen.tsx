import React, { useState } from 'react';
import { AchievementScreenProps } from '../types';
import '../../styles/components/achievement-screen.scss';
import eggIcon from '../graphics/creature_sprites/egg.gif';
import chocoIcon from '../graphics/creature_sprites/small_choco/choco-icon-run-2.gif';

const AchievementScreen: React.FC<AchievementScreenProps> = (props: AchievementScreenProps) => {
  // Destructure props for ease of access & documentation
  const {
    currentStatus,
    currentPower,
    currentDefense,
    currentSpeed,
    currentEndurance,
    battlesWon,
    racesWon
  } = props;

  const hitMaxPower = (currentPower === 10);
  const hitMaxDefense = (currentDefense === 10);
  const hitMaxSpeed = (currentSpeed === 10);
  const hitMaxEndurance = (currentEndurance === 10);

  return (
    <div id='AchievementScreen' className='game-screen additional-screen'>
        <div className='title'>
            Achievements
        </div>

        <div className='achievement-list'>
            <div className='achievement'>
                Battles Won: {battlesWon}
            </div>
            <div className='achievement'>
                Races Won: {racesWon}
            </div>
            <div className='achievement'>
                {
                    hitMaxPower ? (
                        <>
                            Hit Max Power!
                        </>
                    ) : (
                        <>
                            ???
                        </>
                    )
                }
            </div>
            <div className='achievement'>
                {
                    hitMaxDefense ? (
                        <>
                            Hit Max Defense!
                        </>
                    ) : (
                        <>
                            ???
                        </>
                    )
                }
            </div>
            <div className='achievement'>
                {
                    hitMaxSpeed ? (
                        <>
                            Hit Max Speed!
                        </>
                    ) : (
                        <>
                            ???
                        </>
                    )
                }
            </div>
            <div className='achievement'>
                {
                    hitMaxEndurance ? (
                        <>
                            Hit Max Endurance!
                        </>
                    ) : (
                        <>
                            ???
                        </>
                    )
                }
            </div>
        </div>

        <div className='status-details'>
            <div className='choco-icon'>
                <img src={currentStatus === 'Egg' ? eggIcon : chocoIcon} />
            </div>
        </div>
    </div>
  );
};

export default AchievementScreen;