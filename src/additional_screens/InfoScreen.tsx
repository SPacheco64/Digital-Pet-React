import React, { useState } from 'react';
import { InfoScreenProps } from '../types';
import '../../styles/components/info-screen.scss';
import chocoIcon from '../graphics/creature_sprites/small_choco/choco-icon-run-2.gif';
import eggIcon from '../graphics/creature_sprites/egg.gif'
import statusIcon from '../graphics/icons/game_buttons/menu/feather.svg';
import infoIcon from '../graphics/icons/game_buttons/menu/info.svg';
import shopIcon from '../graphics/icons/game_buttons/menu/shop.svg';
import achievementIcon from '../graphics/icons/game_buttons/menu/achievement.svg';

const InfoScreen: React.FC<InfoScreenProps> = (props: InfoScreenProps) => {
  // Destructure props for ease of access & documentation
  const {
    currentStatus,
  } = props;

  return (
    <div id='InfoScreen' className='game-screen additional-screen'>
        <div className='title'>
            Info & Tips
        </div>

        <div className='info-text'>
            <div className='info-block'>
                lorem ipsum choco sipsum gyshal greens for the beans<br/>
                lorem ipsum choco sipsum gyshal greens for the beans<br/>
            </div>

            <div className='info-block'>
                this guy are sick but he ain't no stick<br/>
                this guy are sick but he ain't no stick<br/>
            </div>

            <div className='info-block'>
                did sephiroth do this?<br/>
                did sephiroth do this?<br/>
            </div>
        </div>

        {/* <div className='choco-icon'>
            <img src={currentStatus === 'Egg' ? eggIcon : chocoIcon} />
        </div> */}
    </div>
  );
};

export default InfoScreen;