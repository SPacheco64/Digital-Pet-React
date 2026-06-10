import React, { useState } from 'react';
import { MenuScreenProps, StatusScreenProps } from '../types';
import '../../styles/components/menu-screen.scss';
import chocoIcon from '../graphics/creature_sprites/small_choco/choco-icon-eat.gif';
import eggIcon from '../graphics/creature_sprites/egg.gif'
import statusIcon from '../graphics/icons/game_buttons/menu/feather.svg';
import infoIcon from '../graphics/icons/game_buttons/menu/info.svg';
import shopIcon from '../graphics/icons/game_buttons/menu/shop.svg';
import achievementIcon from '../graphics/icons/game_buttons/menu/achievement.svg';

const MenuScreen: React.FC<MenuScreenProps> = (props: MenuScreenProps) => {
  // Destructure props for ease of access & documentation
  const {
    currentStatus,
  } = props;

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
                Info & Tips
            </div>
        </div>
        <div className='choco-icon'>
            <img src={currentStatus === 'Egg' ? eggIcon : chocoIcon} />
        </div>
    </div>
  );
};

export default MenuScreen;