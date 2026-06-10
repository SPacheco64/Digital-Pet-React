import React, { useState } from 'react';
import { ShopScreenProps } from '../types';
import '../../styles/components/shop-screen.scss';
import chocoIcon from '../graphics/creature_sprites/small_choco/choco-icon-run-2.gif';
import eggIcon from '../graphics/creature_sprites/egg.gif'
import statusIcon from '../graphics/icons/game_buttons/menu/feather.svg';
import infoIcon from '../graphics/icons/game_buttons/menu/info.svg';
import shopIcon from '../graphics/icons/game_buttons/menu/shop.svg';
import achievementIcon from '../graphics/icons/game_buttons/menu/achievement.svg';
import gysahlGreens from '../graphics/icons/shop/gysahl_greens.png';

const ShopScreen: React.FC<ShopScreenProps> = (props: ShopScreenProps) => {
  // Destructure props for ease of access & documentation
  const {
    currentStatus,
    currentMoney,
  } = props;

  return (
    <div id='ShopScreen' className='game-screen additional-screen'>
        <div className='title'>
            Shop
        </div>
        <div className='current-money'>
            $ {currentMoney}
        </div>

        <div className='shop-list'>
            <div className='shop-item'>
                <div className='cost'>
                    $50
                </div>

                <div className='item-top'>
                    <span className='item-image'><img src={gysahlGreens} alt='Gysahl Greens' /></span>
                    <span className='label'>Gysahl Greens</span>
                </div>

                <div className='item-descriptions'>
                    Permanently increases the effectiveness of Feeding.
                </div>
            </div>

            <div className='shop-item'>
                <div className='cost'>
                    $100
                </div>

                <div className='item-top'>
                    <span className='item-image'><img src={gysahlGreens} alt='Power Charm' /></span>
                    <span className='label'>Power Charm</span>
                </div>

                <div className='item-descriptions'>
                    Permanently increases the effectiveness of Power training.
                </div>
            </div>

            <div className='shop-item'>
                <div className='cost'>
                    $100
                </div>

                <div className='item-top'>
                    <span className='item-image'><img src={gysahlGreens} alt='Defense Charm' /></span>
                    <span className='label'>Defense Charm</span>
                </div>

                <div className='item-descriptions'>
                    Permanently increases the effectiveness of Defense training.
                </div>
            </div>

            <div className='shop-item'>
                <div className='cost'>
                    $100
                </div>

                <div className='item-top'>
                    <span className='item-image'><img src={gysahlGreens} alt='Speed Bangle' /></span>
                    <span className='label'>Speed Bangle</span>
                </div>

                <div className='item-descriptions'>
                    Permanently increases the effectiveness of Speed training.
                </div>
            </div>

            <div className='shop-item'>
                <div className='cost'>
                    $100
                </div>

                <div className='item-top'>
                    <span className='item-image'><img src={gysahlGreens} alt='Endure Bangle' /></span>
                    <span className='label'>Endure Bangle</span>
                </div>

                <div className='item-descriptions'>
                    Permanently increases the effectiveness of Endurance training.
                </div>
            </div>
        </div>

        {/* <div className='choco-icon'>
            <img src={currentStatus === 'Egg' ? eggIcon : chocoIcon} />
        </div> */}
    </div>
  );
};

export default ShopScreen;