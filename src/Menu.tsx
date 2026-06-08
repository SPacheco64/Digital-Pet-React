import React, { useState } from 'react';
import { MenuProps } from './types';
import '../styles/components/menu.scss';
import MenuOption from './helpers/MenuOption';
import feedIcon from './graphics/icons/game_buttons/normal/feed.svg';
import trainIcon from './graphics/icons/game_buttons/normal/train.svg';
import playIcon from './graphics/icons/game_buttons/normal/play.svg';
import sleepIcon from './graphics/icons/game_buttons/normal/sleep.svg';
import statusIcon from './graphics/icons/game_buttons/normal/status.svg';
import backIcon from './graphics/icons/game_buttons/normal/back.svg';

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  // Destructure props for ease of access & documentation
  const {
    inCombat,
    currentStatus,
    showStatusWindow,
    setInCombat,
    setCurrentStatus,
    setShowStatusWindow,
  } = props;

  const [specialsOpen, setSpecialsOpen] = useState<boolean>(false);
  
  const normalButtonList = [
    {buttonName: 'Feed', buttonIcon: feedIcon, buttonFunction: ()=>{setCurrentStatus('eating')}},
    {buttonName: 'Train', buttonIcon: trainIcon, buttonFunction: ()=>{setCurrentStatus('training')}},
    {buttonName: 'Play', buttonIcon: playIcon, buttonFunction: ()=>{console.log('Play option clicked')}},
    {buttonName: 'Sleep', buttonIcon: sleepIcon, buttonFunction: ()=>{console.log('Sleep option clicked')}},
    {buttonName: 'Status', buttonIcon: (showStatusWindow ? backIcon : statusIcon), buttonFunction: ()=>{setShowStatusWindow(!showStatusWindow)}},
  ];

  const combatButtonList = [
    {buttonName: 'Attack', buttonIcon: '', buttonFunction: ()=>{}},
    {buttonName: 'Special', buttonIcon: '', buttonFunction: ()=>{}},
    {buttonName: 'Run', buttonIcon: '', buttonFunction: ()=>{}},
  ];

  return (
    <div id='Menu'>
      {
        // Normal Menu Options
        !inCombat && (
        <>
          {
            normalButtonList.map((button, index) => (
              <span className={`normal-button-${index}`}>
                <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName} />
              </span>
            ))
          }
        </>
        )
      }
      {/* {
        // Combat Menu Options
        inCombat && !specialsOpen && (
          <>
            <MenuOption onClick={() => console.log('Attack option clicked')} optionName='Attack' />
            <MenuOption onClick={() => setSpecialsOpen(true)} optionName='Special' />
            <MenuOption onClick={() => setInCombat(false)} optionName='Run' />
          </>
        )
      } */}
      {/* {
        // Special Action Menu Options
        inCombat && specialsOpen && (
          <>
            <MenuOption onClick={() => console.log('Special 1 option clicked')} optionName='Special 1' />
            <MenuOption onClick={() => console.log('Special 2 option clicked')} optionName='Special 2' />
            <MenuOption onClick={() => setSpecialsOpen(false)} optionName='Back' />
          </>
        )
      } */}
    </div>
  );
};

export default Menu;