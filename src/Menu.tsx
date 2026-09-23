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
import rockIcon from './graphics/icons/game_buttons/normal/rock.svg';
import paperIcon from './graphics/icons/game_buttons/normal/paper.svg';
import scissorsIcon from './graphics/icons/game_buttons/normal/scissors.svg';
import menuIcon from './graphics/icons/game_buttons/normal/menu.svg';
import statusIcon from './graphics/icons/game_buttons/menu/feather.svg';
import infoIcon from './graphics/icons/game_buttons/menu/info.svg';
import shopIcon from './graphics/icons/game_buttons/menu/shop.svg';
import achievementIcon from './graphics/icons/game_buttons/menu/achievement.svg';
import attackIcon from './graphics/icons/game_buttons/combat/attack.svg';
import specialIcon from './graphics/icons/game_buttons/combat/magic.svg';
import runIcon from './graphics/icons/game_buttons/combat/run.svg';
import hookIcon from './graphics/icons/game_buttons/normal/hook.svg';
import { attackFunction, escapeFunction, specialFunction } from './helpers/functions/BattleLogic';

const MIN_PLAY_ENERGY = 3;
const MIN_TRAINING_ENERGY = 20;
const HIGH_HUNGER_THRESHOLD = 80;

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  // Destructure props for ease of access & documentation
  const {
    currentStatus,
    currentEnergy,
    currentHunger,
    currentlyBusy,
    questionWindowOpen,
    showMenuScreen,
    showStatusScreen,
    showShopScreen,
    showAchievementsScreen,
    showInfoScreen,
    showBattleScreen,
    playerAttack,
    enemyAttack,
    playerSpecial,
    enemySpecial,
    playerRunning,
    fishingOpen,
    fishingComplete,
    rpsOpen,
    welcomeFormHidden,
    setCurrentlyBusy,
    setShowBattleScreen,
    setCurrentStatus,
    setActionFailureTrigger,
    setShowMenuScreen,
    setShowStatusScreen,
    setShowShopScreen,
    setShowAchievementsScreen,
    setShowInfoScreen,
    setOptionSelected,
    setQuestionWindowOpen,
    setCurrentQuestionType,
    setFishingOpen,
    setFishingComplete,
    setFishingInput,
    setRpsOpen,
    setRpsInput,

    // Props for battle & race functions:
    setPlayerAttack,
    setEnemyAttack,
    setPlayerSpecial,
    setEnemySpecial,
    setPlayerRunning

  } = props;

  const checkIfDisabled = (index: number) => {
    return (showStatusScreen && index > 0) || (showAchievementsScreen && index != 2)
      || (showInfoScreen && index !== 3) || (showShopScreen && index !== 1) ||
      (showBattleScreen && index === 0) || (showBattleScreen && index === 4) ||
      (showBattleScreen && (playerAttack || enemyAttack || playerSpecial || enemySpecial || playerRunning));
  };

  const [trainingOpen, setTrainingOpen] = useState<boolean>(false);
  const [playOpen, setPlayOpen] = useState<boolean>(false);

  const actionFailsWhileSad = () => currentStatus === 'sad' && Math.random() < 0.25;
  const actionFailsWhileHungry = () => currentHunger >= HIGH_HUNGER_THRESHOLD && Math.random() < 0.25;

  const actionFails = () => {
    console.log('Action failed due to sadness!');
    setActionFailureTrigger(trigger => trigger + 1);
  };

  const normalButtonList = [
    {buttonName: 'Feed', buttonIcon: feedIcon, buttonFunction: ()=>{if (actionFailsWhileSad()) { actionFails(); return; } setCurrentStatus('eating'); setCurrentlyBusy(true);}},
    {buttonName: 'Train', buttonIcon: trainIcon, buttonFunction: ()=>{if (actionFailsWhileSad() || actionFailsWhileHungry()) { actionFails(); return; } setCurrentlyBusy(true); setPlayOpen(false); setTrainingOpen(true); setQuestionWindowOpen(true); setCurrentQuestionType('training');}},
    {buttonName: 'Play', buttonIcon: playIcon, buttonFunction: ()=>{if (actionFailsWhileSad() || actionFailsWhileHungry()) { actionFails(); return; } setCurrentlyBusy(true); setTrainingOpen(false); setPlayOpen(true); setQuestionWindowOpen(true); setCurrentQuestionType('play');}},
    {buttonName: 'Sleep', buttonIcon: sleepIcon, buttonFunction: ()=>{if (actionFailsWhileSad() || actionFailsWhileHungry()) { actionFails(); return; } setCurrentStatus('sleeping'); setCurrentlyBusy(true);}},
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
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: 'Attack', buttonIcon: attackIcon, buttonFunction: ()=>{setPlayerAttack(true); attackFunction(setPlayerAttack);}},
    {buttonName: 'Special', buttonIcon: specialIcon, buttonFunction: ()=>{setPlayerSpecial(true); specialFunction()}},
    {buttonName: 'Run', buttonIcon: runIcon, buttonFunction: ()=>{setPlayerRunning(true); escapeFunction(setPlayerRunning)}},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
  ];

  const fishingButtonList = [
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: 'Go Back', buttonIcon: backIcon, buttonFunction: ()=>{
      setFishingOpen(false);
      setFishingComplete(false);
      setFishingInput(0);
      setCurrentlyBusy(false);
    }},
    {buttonName: 'Fish', buttonIcon: hookIcon, buttonFunction: ()=>{setFishingInput(input => input + 1);}},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
  ];

  const rpsButtonList = [
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: 'Rock', buttonIcon: rockIcon, buttonFunction: ()=>{setRpsInput(1);}},
    {buttonName: 'Paper', buttonIcon: paperIcon, buttonFunction: ()=>{setRpsInput(2);}},
    {buttonName: 'Scissors', buttonIcon: scissorsIcon, buttonFunction: ()=>{setRpsInput(3);}},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
  ];

  const trainingQuestionButtonList = [
    {buttonName: 'Power', buttonIcon: oneIcon, buttonFunction: ()=>{setOptionSelected(1); setQuestionWindowOpen(false); setTrainingOpen(false);}},
    {buttonName: 'Defense', buttonIcon: twoIcon, buttonFunction: ()=>{setOptionSelected(2); setQuestionWindowOpen(false); setTrainingOpen(false);}},
    {buttonName: 'Speed', buttonIcon: threeIcon, buttonFunction: ()=>{setOptionSelected(3); setQuestionWindowOpen(false); setTrainingOpen(false);}},
    {buttonName: 'Endurance', buttonIcon: fourIcon, buttonFunction: ()=>{setOptionSelected(4); setQuestionWindowOpen(false); setTrainingOpen(false);}},
    {buttonName: 'Go Back', buttonIcon: backIcon, buttonFunction: ()=>{setTrainingOpen(false); setCurrentlyBusy(false); setQuestionWindowOpen(false);}},
  ];

  const playQuestionButtonList = [
    {buttonName: 'Rock, Paper, Scissors', buttonIcon: oneIcon, buttonFunction: ()=>{setOptionSelected(1); setPlayOpen(false); setRpsInput(0); setRpsOpen(true); setQuestionWindowOpen(false);}},
    {buttonName: 'Fishing', buttonIcon: twoIcon, buttonFunction: ()=>{setOptionSelected(2); setPlayOpen(false); setFishingComplete(false); setFishingInput(0); setFishingOpen(true); setQuestionWindowOpen(false);}},
    {buttonName: 'Race', buttonIcon: threeIcon, buttonFunction: ()=>{setOptionSelected(3); setPlayOpen(false); setQuestionWindowOpen(false);}},
    {buttonName: 'Battle', buttonIcon: fourIcon, buttonFunction: ()=>{setOptionSelected(4); setPlayOpen(false); setQuestionWindowOpen(false); setShowBattleScreen(true)}},
    {buttonName: 'Go Back', buttonIcon: backIcon, buttonFunction: ()=>{setPlayOpen(false); setCurrentlyBusy(false); setQuestionWindowOpen(false);}},
  ];

  return (
    <div id='Menu'>
      {
        // Normal Menu Options
        !showBattleScreen && !questionWindowOpen && !showMenuScreen && !fishingOpen && !rpsOpen && (
        <>
          {
            normalButtonList.map((button, index) => (
              <span key={index} className={`normal-button-${index} ${(
                (currentlyBusy && index < 4) ||
                !welcomeFormHidden ||
                (index === 1 && currentEnergy < MIN_TRAINING_ENERGY) ||
                (index === 2 && currentEnergy < MIN_PLAY_ENERGY)
              ) ? 'disabled' : ''}`}>
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

      {
        showBattleScreen &&
        <>
          {
            combatButtonList.map((button, index) => (
              <span key={index} className={`normal-button-${index} ${checkIfDisabled(index) ? 'disabled' : ''}`}>
                <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName} />
              </span>
            ))
          }
        </>
      }

      {
        fishingOpen &&
        <>
          {
            fishingButtonList.map((button, index) => (
                <span key={index} className={`normal-button-${index} ${(!fishingComplete && index === 2) || (fishingComplete && index === 1) ? '' : 'disabled'}`}>
                <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName || 'Inactive'} />
              </span>
            ))
          }
        </>
      }

      {
        rpsOpen &&
        <>
          {
            rpsButtonList.map((button, index) => (
              <span key={index} className={`normal-button-${index} ${index === 0 || index === 4 ? 'disabled' : ''}`}>
                <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName || 'Inactive'} />
              </span>
            ))
          }
        </>
      }
    </div>
  );
};

export default Menu;