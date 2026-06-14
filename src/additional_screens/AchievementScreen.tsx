import React from 'react';
import { AchievementScreenProps } from '../types';
import '../../styles/components/achievement-screen.scss';
import MenuCanvas from '../helpers/canvas/MenuCanvas';

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

  const achievementArray = [
    {label: 'Battles Won:', value: battlesWon},
    {label: 'Races Won:', value: racesWon},
  ];

  const hiddenAchievementArray = [
    {label: 'Hit Max Power!', value: hitMaxPower},
    {label: 'Hit Max Defense!', value: hitMaxDefense},
    {label: 'Hit Max Speed!', value: hitMaxSpeed},
    {label: 'Hit Max Endurance!', value: hitMaxEndurance},
  ];

  return (
    <div id='AchievementScreen' className='game-screen additional-screen'>
        <div className='title'>
            Achievements
        </div>

        <div className='achievement-list'>
            {
                achievementArray.map((achievement, index) => ( 
                    <>
                        <div className='achievement' key={index}>
                            {achievement.label} {achievement.value}
                        </div>
                    </>
                ))
            }

            {
                hiddenAchievementArray.map((achievement, index) => ( 
                    <>
                        <div className='achievement' key={index}>
                            {
                                (achievement.value) ? 
                                <>
                                    {achievement.label}
                                </> :
                                <>
                                    ???
                                </>
                            }
                        </div>
                    </>
                ))
            }
        </div>

        <MenuCanvas currentStatus={currentStatus} iconToUse={1} />
    </div>
  );
};

export default AchievementScreen;