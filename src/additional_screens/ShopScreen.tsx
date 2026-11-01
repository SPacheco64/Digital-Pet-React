import React, { useState } from 'react';
import { ShopScreenProps } from '../types';
import '../../styles/components/shop-screen.scss';
import shopItems from '../graphics/icons/shop/shop-items.png';

// Positions of the shop item icons within the sprite sheet
const shopIconPositions = [
  [3, 0],
  [44, 0],
  [94, 0],
  [141, 0],
  [182, 0],
  [225, 0],
  [4, 46],
  [44, 46],
  [84, 46],
  [124, 46],
  [166, 46],
  [212, 46],
];

const ShopScreen: React.FC<ShopScreenProps> = (props: ShopScreenProps) => {
  // Destructure props for ease of access & documentation
  const {
    currentMoney,
    alreadyPurchased,
    setCurrentMoney,
    setAlreadyPurchased,
    currentHealth,
    setCurrentHealth,
    maxHealth,
    currentEnergy,
    setCurrentEnergy,
    maxEnergy,
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
    {cost: 50, label: 'Healing Potion', description: 'Fully restores HP.'},
    {cost: 50, label: 'Energy Potion', description: 'Fully restores Energy.'},
    {cost: 100, label: 'Gysahl Greens', description: 'Permanently increases the effectiveness of Feeding.'},
    {cost: 100, label: 'Soft Down', description: 'Permanently increases the effectiveness of Sleeping.'},
    {cost: 100, label: 'Sleeping Cap', description: 'Permanently increases the speed of Sleeping.'},
    {cost: 150, label: 'POW Band', description: 'Permanently increases the effectiveness of Power training.'},
    {cost: 150, label: 'DEF Band', description: 'Permanently increases the effectiveness of Defense training.'},
    {cost: 150, label: 'SPD Band', description: 'Permanently increases the effectiveness of Speed training.'},
    {cost: 150, label: 'END Band', description: 'Permanently increases the effectiveness of Endurance training.'},
    {cost: 250, label: 'POW Materia', description: 'Increases POW in battles.'},
    {cost: 250, label: 'DEF Materia', description: 'Increases DEF in battles.'},
    {cost: 500, label: 'Moogle', description: 'Gain a Moogle companion. Might help in Battle...'}
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
                shopList.map((item, index) => {
                    const [spriteX, spriteY] = shopIconPositions[index];
                    return (
                    <button
                        type='button'
                        className={`shop-item ${(alreadyPurchased.includes(index) && index > 1) ? 'already-purchased' : ''}`}
                        key={index}
                        disabled={alreadyPurchased.includes(index) && index > 1}
                        onClick={() => {
                            if (index === 0) { // Healing potion purchased
                                if (currentHealth === maxHealth || currentMoney < item.cost) return;
                                setCurrentHealth(maxHealth);
                            } else if (index === 1) { // Energy potion purchased
                                if (currentEnergy === maxEnergy || currentMoney < item.cost) return;
                                setCurrentEnergy(maxEnergy);
                            }

                            purchaseHandler(index, item.cost);
                        }}>
                        <div className='cost'>
                            {
                                (alreadyPurchased.includes(index) && index > 1) ?
                                <>
                                    SOLD
                                </> :
                                <>
                                    {item.cost}<span className='currency-symbol'>G</span>
                                </>
                            }
                        </div>

                        <div className='item-top'>
                            <span
                                className='item-image'
                                role='img'
                                aria-label={item.label}
                                style={{
                                    backgroundImage: `url(${shopItems})`,
                                    backgroundPosition: `-${spriteX}px -${spriteY}px`,
                                }}
                            />
                            <span className='label'>{item.label}</span>
                        </div>

                        <div className='item-descriptions'>
                            {item.description}
                        </div>
                    </button>
                    );
                })
            }
        </div>
    </div>
  );
};

export default ShopScreen;