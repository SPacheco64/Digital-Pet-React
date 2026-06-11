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
    alreadyPurchased,
    setCurrentMoney,
    setAlreadyPurchased
  } = props;

  const purchaseHandler = (index: number, cost: number) => {
    if (cost <= currentMoney) {
        setCurrentMoney(prevMoney => (prevMoney - cost));
        setAlreadyPurchased([...alreadyPurchased, index]);
    } else {
        // Play sound effect for failure to purchase
    }
  }

  const shopList = [
    {cost: 50, image: gysahlGreens, label: 'Gysahl Greens', description: 'Permanently increases the effectiveness of Feeding.'},
    {cost: 50, image: gysahlGreens, label: 'Cushy Pillow', description: 'Permanently increases the effectiveness of Sleeping.'},
    {cost: 100, image: gysahlGreens, label: 'POW Band', description: 'Permanently increases the effectiveness of Power training.'},
    {cost: 100, image: gysahlGreens, label: 'DEF Band', description: 'Permanently increases the effectiveness of Defense training.'},
    {cost: 100, image: gysahlGreens, label: 'SPD Band', description: 'Permanently increases the effectiveness of Speed training.'},
    {cost: 100, image: gysahlGreens, label: 'END Band', description: 'Permanently increases the effectiveness of Endurance training.'},
    {cost: 200, image: gysahlGreens, label: 'POW Materia', description: 'Increases POW in battles.'},
    {cost: 200, image: gysahlGreens, label: 'DEF Materia', description: 'Increases DEF in battles.'},
    {cost: 500, image: gysahlGreens, label: 'Moogle', description: 'Gain a Moogle companion. Might help with Magic...'}
  ];

  return (
    <div id='ShopScreen' className='game-screen additional-screen'>
        <div className='title'>
            Shop
        </div>
        <div className='current-money'>
            {currentMoney} <span className='currency-symbol'>G</span>
        </div>

        <div className='shop-list'>
            {
                shopList.map((item, index) => (
                    <div className={`shop-item ${alreadyPurchased.includes(index) ? 'already-purchased' : ''}`} 
                        key={index} onClick={() => {purchaseHandler(index, item.cost)}}>
                        <div className='cost'>
                            {
                                alreadyPurchased.includes(index) ?
                                <>
                                    SOLD
                                </> :
                                <>
                                    {item.cost}<span className='currency-symbol'>G</span>
                                </>
                            }
                        </div>

                        <div className='item-top'>
                            <span className='item-image'><img src={item.image} alt={item.label} /></span>
                            <span className='label'>{item.label}</span>
                        </div>

                        <div className='item-descriptions'>
                            {item.description}
                        </div>
                    </div>
                ))
            }
        </div>

        {/* <div className='choco-icon'>
            <img src={currentStatus === 'Egg' ? eggIcon : chocoIcon} />
        </div> */}
    </div>
  );
};

export default ShopScreen;