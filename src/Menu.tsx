import React, { useEffect, useState } from 'react';
import { MenuProps } from './types';
import '../styles/components/menu.scss';
import MenuOption from './helpers/components/MenuOption';
import feedIcon from './graphics/icons/game_buttons/normal/feed.svg';
import trainIcon from './graphics/icons/game_buttons/normal/train.svg';
import playIcon from './graphics/icons/game_buttons/normal/play.svg';
import sleepIcon from './graphics/icons/game_buttons/normal/sleep.svg';
import backIcon from './graphics/icons/game_buttons/normal/back.svg';
import emptyIcon from './graphics/icons/game_buttons/normal/empty.svg';
import oneIcon from './graphics/icons/game_buttons/normal/one.svg';
import twoIcon from './graphics/icons/game_buttons/normal/two.svg';
import threeIcon from './graphics/icons/game_buttons/normal/three.svg';
import fourIcon from './graphics/icons/game_buttons/normal/four.svg';
import menuIcon from './graphics/icons/game_buttons/normal/menu.svg';
import statusIcon from './graphics/icons/game_buttons/menu/feather.svg';
import infoIcon from './graphics/icons/game_buttons/menu/info.svg';
import shopIcon from './graphics/icons/game_buttons/menu/shop.svg';
import achievementIcon from './graphics/icons/game_buttons/menu/achievement.svg';

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  // Destructure props for ease of access & documentation
  const {
    inCombat,
    currentStatus,
    currentlyBusy,
    questionWindowOpen,
    showMenuScreen,
    showStatusScreen,
    showShopScreen,
    showAchievementsScreen,
    showInfoScreen,
    setCurrentlyBusy,
    setInCombat,
    setCurrentStatus,
    setShowMenuScreen,
    setShowStatusScreen,
    setShowShopScreen,
    setShowAchievementsScreen,
    setShowInfoScreen,
    setOptionSelected,
    setQuestionWindowOpen,
    setCurrentQuestionType,
  } = props;

  const checkIfDisabled = (index: number) => {
    return (showStatusScreen && index > 0) || (showAchievementsScreen && index != 2)
      || (showInfoScreen && index !== 3) || (showShopScreen && index !== 1);
  };

  const [specialsOpen, setSpecialsOpen] = useState<boolean>(false);
  const [trainingOpen, setTrainingOpen] = useState<boolean>(false);
  const [playOpen, setPlayOpen] = useState<boolean>(false);
  
  const normalButtonList = [
    {buttonName: 'Feed', buttonIcon: feedIcon, buttonFunction: ()=>{setCurrentStatus('eating'); setCurrentlyBusy(true);}},
    {buttonName: 'Train', buttonIcon: trainIcon, buttonFunction: ()=>{setCurrentlyBusy(true); setTrainingOpen(true); setQuestionWindowOpen(true); setCurrentQuestionType('training');}},
    {buttonName: 'Play', buttonIcon: playIcon, buttonFunction: ()=>{setCurrentlyBusy(true); setPlayOpen(true); setQuestionWindowOpen(true); setCurrentQuestionType('play');}},
    {buttonName: 'Sleep', buttonIcon: sleepIcon, buttonFunction: ()=>{setCurrentStatus('sleeping'); setCurrentlyBusy(true);}},
    {buttonName: 'Menu', buttonIcon: menuIcon, buttonFunction: ()=>{setShowMenuScreen(!showMenuScreen);}},
  ];

  const menuScreenButtonList = [
    {buttonName: 'Status', buttonIcon: (showStatusScreen ? backIcon : statusIcon), buttonFunction: ()=>{setShowStatusScreen(!showStatusScreen);}},
    {buttonName: 'Shop', buttonIcon: (showShopScreen ? backIcon : shopIcon), buttonFunction: ()=>{setShowShopScreen(!showShopScreen)}},
    {buttonName: 'Achievements', buttonIcon: (showAchievementsScreen ? backIcon : achievementIcon), buttonFunction: ()=>{setShowAchievementsScreen(!showAchievementsScreen)}},
    {buttonName: 'Info', buttonIcon: (showInfoScreen ? backIcon : infoIcon), buttonFunction: ()=>{setShowInfoScreen(!showInfoScreen)}},
    {buttonName: 'Go Back', buttonIcon: backIcon, buttonFunction: ()=>{setShowMenuScreen(!showMenuScreen);}},
  ];

  const combatButtonList = [
    {buttonName: 'Attack', buttonIcon: '', buttonFunction: ()=>{}},
    {buttonName: 'Special', buttonIcon: '', buttonFunction: ()=>{}},
    {buttonName: 'Run', buttonIcon: '', buttonFunction: ()=>{}},
  ];

  const trainingQuestionButtonList = [
    {buttonName: 'Power', buttonIcon: oneIcon, buttonFunction: ()=>{setOptionSelected(1); setQuestionWindowOpen(false); setTrainingOpen(false);}},
    {buttonName: 'Defense', buttonIcon: twoIcon, buttonFunction: ()=>{setOptionSelected(2); setQuestionWindowOpen(false); setTrainingOpen(false);}},
    {buttonName: 'Speed', buttonIcon: threeIcon, buttonFunction: ()=>{setOptionSelected(3); setQuestionWindowOpen(false); setTrainingOpen(false);}},
    {buttonName: 'Endurance', buttonIcon: fourIcon, buttonFunction: ()=>{setOptionSelected(4); setQuestionWindowOpen(false); setTrainingOpen(false);}},
    {buttonName: 'Go Back', buttonIcon: backIcon, buttonFunction: ()=>{setTrainingOpen(false); setCurrentlyBusy(false); setQuestionWindowOpen(false);}},
  ];

  const playQuestionButtonList = [
    {buttonName: 'Rock, Paper, Scissors', buttonIcon: oneIcon, buttonFunction: ()=>{setOptionSelected(1); setQuestionWindowOpen(false);}},
    {buttonName: 'Guess', buttonIcon: twoIcon, buttonFunction: ()=>{setOptionSelected(2); setQuestionWindowOpen(false);}},
    {buttonName: 'Race', buttonIcon: threeIcon, buttonFunction: ()=>{setOptionSelected(3); setQuestionWindowOpen(false);}},
    {buttonName: 'Battle', buttonIcon: fourIcon, buttonFunction: ()=>{setOptionSelected(4); setQuestionWindowOpen(false);}},
    {buttonName: 'Go Back', buttonIcon: backIcon, buttonFunction: ()=>{setPlayOpen(false); setCurrentlyBusy(false); setQuestionWindowOpen(false);}},
  ];

  return (
    <div id='Menu'>
      {
        // Normal Menu Options
        !inCombat && !questionWindowOpen && !showMenuScreen && (
        <>
          {
            normalButtonList.map((button, index) => (
              <span key={index} className={`normal-button-${index} ${(currentlyBusy && index < 4) ? 'disabled' : ''}`}>
                <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName} />
              </span>
            ))
          }
        </>
        )
      }

      {
        showMenuScreen &&
        <>
          {
            menuScreenButtonList.map((button, index) => (
              <span key={index} className={`normal-button-${index} ${checkIfDisabled(index) ? 'disabled' : ''}`}>
                <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName} />
              </span>
            ))
          }
        </>
      }

      {
        questionWindowOpen &&
        <>
          {
            trainingOpen && 
            <>
              {
                trainingQuestionButtonList.map((button, index) => (
                  <span key={index} className={`normal-button-${index}`}>
                    <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName} />
                  </span>
                ))
              }
            </>
          }

          {
            playOpen && 
            <>
              {
                playQuestionButtonList.map((button, index) => (
                  <span key={index} className={`normal-button-${index}`}>
                    <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName} />
                  </span>
                ))
              }
            </>
          }
        </>
      }
    </div>
  );
};

export default Menu;