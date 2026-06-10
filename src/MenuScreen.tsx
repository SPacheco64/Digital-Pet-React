import React, { useState } from 'react';
import { StatusWindowProps } from './types';
import '../styles/components/menu-screen.scss';
import chocoIcon from './graphics/creature_sprites/small_choco/choco-icon-eat.gif';
import statusIcon from './graphics/icons/game_buttons/menu/feather.svg';
import infoIcon from './graphics/icons/game_buttons/menu/info.svg';
import shopIcon from './graphics/icons/game_buttons/menu/shop.svg';
import achievementIcon from './graphics/icons/game_buttons/menu/achievement.svg';

const MenuScreen: React.FC<StatusWindowProps> = (props: StatusWindowProps) => {
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
    <div id='MenuScreen'>
        <div className='title'>
            Menu
        </div>
        <div className='menu-list'>
            <div className='menu-option'>
                <span className='menu-icon'><img src={statusIcon} /></span>
                Status
            </div>
            <div className='menu-option'>
                <span className='menu-icon'><img src={shopIcon} /></span>
                Shop
            </div>
            <div className='menu-option'>
                <span className='menu-icon'><img src={achievementIcon} /></span>
                Achievements
            </div>
            <div className='menu-option'>
                <span className='menu-icon'><img src={infoIcon} /></span>
                App Info
            </div>
        </div>
        <div className='choco-icon'>
            <img src={chocoIcon} />
        </div>
    </div>
  );
};

export default MenuScreen;