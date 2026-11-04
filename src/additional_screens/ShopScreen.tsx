import React, { useEffect, useState } from 'react';
import { ShopScreenProps } from '../types';
import '../../styles/components/shop-screen.scss';
import shopItems from '../graphics/icons/shop/shop-items.png';
import { SHOP_ITEM_NAMES } from '../constants/shopItems';

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
  const [shopItemsLoaded, setShopItemsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const image = new Image();

    image.onload = () => {
      if (isMounted) {
        setShopItemsLoaded(true);
      }
    };
    image.onerror = () => {
      console.error(`Failed to load shop item icons: ${shopItems}`);
    };
    image.src = shopItems;

    if (image.complete && image.naturalWidth > 0) {
      setShopItemsLoaded(true);
    }

    return () => {
      isMounted = false;
      image.onload = null;
      image.onerror = null;
    };
  }, []);

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

  const purchaseHandler = (itemName: string, cost: number) => {
    if (cost <= currentMoney) {
        setCurrentMoney(prevMoney => (prevMoney - cost));
        setAlreadyPurchased(purchased => (
            purchased.includes(itemName) ? purchased : [...purchased, itemName]
        ));
    } else {
        // Play sound effect for failure to purchase
    }
  }

  const shopList = [
    {cost: 50, label: SHOP_ITEM_NAMES.healingPotion, description: 'Fully restores HP.', repeatable: true, effect: 'health'},
    {cost: 50, label: SHOP_ITEM_NAMES.energyPotion, description: 'Fully restores Energy.', repeatable: true, effect: 'energy'},
    {cost: 100, label: SHOP_ITEM_NAMES.gysahlGreens, description: 'Permanently increases the effectiveness of Feeding.'},
    {cost: 100, label: SHOP_ITEM_NAMES.softDown, description: 'Permanently increases the effectiveness of Sleeping.'},
    {cost: 100, label: SHOP_ITEM_NAMES.sleepingCap, description: 'Permanently increases the speed of Sleeping.'},
    {cost: 150, label: SHOP_ITEM_NAMES.powBand, description: 'Permanently increases the effectiveness of Power training.'},
    {cost: 150, label: SHOP_ITEM_NAMES.defBand, description: 'Permanently increases the effectiveness of Defense training.'},
    {cost: 150, label: SHOP_ITEM_NAMES.spdBand, description: 'Permanently increases the effectiveness of Speed training.'},
    {cost: 150, label: SHOP_ITEM_NAMES.endBand, description: 'Permanently increases the effectiveness of Endurance training.'},
    {cost: 250, label: SHOP_ITEM_NAMES.powMateria, description: 'Increases POW in battles.'},
    {cost: 250, label: SHOP_ITEM_NAMES.defMateria, description: 'Increases DEF in battles.'},
    {cost: 500, label: SHOP_ITEM_NAMES.moogle, description: 'Gain a Moogle companion. Might help in Battle...'}
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
                    const isAlreadyPurchased = alreadyPurchased.includes(item.label);
                    return (
                    <button
                        type='button'
                        className={`shop-item ${(isAlreadyPurchased && !item.repeatable) ? 'already-purchased' : ''}`}
                        key={item.label}
                        disabled={isAlreadyPurchased && !item.repeatable}
                        onClick={() => {
                            if (item.effect === 'health') {
                                if (currentHealth === maxHealth || currentMoney < item.cost) return;
                                setCurrentHealth(maxHealth);
                            } else if (item.effect === 'energy') {
                                if (currentEnergy === maxEnergy || currentMoney < item.cost) return;
                                setCurrentEnergy(maxEnergy);
                            }

                            purchaseHandler(item.label, item.cost);
                        }}>
                        <div className='cost'>
                            {
                                (isAlreadyPurchased && !item.repeatable) ?
                                <>
                                    SOLD
                                </> :
                                <>
                                    {item.cost}<span className='currency-symbol'>G</span>
                                </>
                            }
                        </div>

                        <div className='item-top'>
                            {shopItemsLoaded ? (
                                <span
                                    className='item-image'
                                    role='img'
                                    aria-label={item.label}
                                    style={{
                                        backgroundImage: `url(${shopItems})`,
                                        backgroundPosition: `-${spriteX}px -${spriteY}px`,
                                    }}
                                />
                            ) : (
                                <span className='item-image item-image-loading' role='status' aria-label={`Loading ${item.label} icon`}>
                                    <span className='shop-item-loading-spinner' aria-hidden='true' />
                                </span>
                            )}
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