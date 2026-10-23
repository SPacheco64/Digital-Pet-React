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
import attackIcon from './graphics/icons/game_buttons/combat/attack.svg';
import specialIcon from './graphics/icons/game_buttons/combat/magic.svg';
import runIcon from './graphics/icons/game_buttons/combat/run.svg';
import hookIcon from './graphics/icons/game_buttons/normal/hook.svg';
import { escapeFunction } from './helpers/functions/BattleLogic';

const MIN_PLAY_ENERGY = 5;
const MIN_TRAINING_ENERGY = 20;
const HIGH_HUNGER_THRESHOLD = 75;

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  // Destructure props for ease of access & documentation
  const {
    activity,
    onActivityChange,
    currentStatus,
    currentHealth,
    maxHealth,
    onAttack,
    onSpecial,
    specialCharge,
    currentEnemyHealth,
    battleLocked,
    currentEnergy,
    maxEnergy,
    currentHunger,
    currentlyBusy,
    questionWindowOpen,
    showMenuScreen,
    showStatusScreen,
    showShopScreen,
    showAchievementsScreen,
    showInfoScreen,
    playerAttack,
    enemyAttack,
    playerSpecial,
    enemySpecial,
    playerRunning,
    fishingComplete,
    raceComplete,
    sprintActive,
    welcomeFormHidden,
    setCurrentlyBusy,
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
    setFishingComplete,
    setFishingInput,
    setRaceComplete,
    setSprintActive,
    setRaceSteeringInput,
    setCurrentHealth,
    setCurrentEnergy,

    // Props for battle & race functions:
    setPlayerSpecial,
    setEnemySpecial,
    setPlayerRunning,

    isLoading,
    setIsLoading,

    inCombat,
  } = props;

  const battleEnded = activity === 'battle' && (currentEnemyHealth <= 0 || currentHealth <= 0);

  const checkIfDisabled = (index: number) => {
    return (showStatusScreen && index > 0) || (showAchievementsScreen && index !== 2)
      || (showInfoScreen && index !== 3) || (showShopScreen && index !== 1) || 
      (activity === 'battle' && index === 4 && !battleEnded) ||
      (activity === 'battle' && index === 2 && specialCharge < 100) ||
      (activity === 'battle' && battleEnded && index !== 4) ||
      (activity === 'battle' && battleLocked) ||
      (activity === 'battle' && (playerAttack || enemyAttack || playerSpecial || enemySpecial || playerRunning)) ||
      isLoading || (inCombat && index === 0);
  };

  const [trainingOpen, setTrainingOpen] = useState<boolean>(false);
  const [playOpen, setPlayOpen] = useState<boolean>(false);

  const actionFailsWhileSad = () => currentStatus === 'sad' && Math.random() < 0.25;
  const actionFailsWhileHungry = () => currentHunger >= HIGH_HUNGER_THRESHOLD && Math.random() < 0.25;
  const sleepButtonDisabled = () => (currentEnergy === maxEnergy && currentHealth === maxHealth);

  const actionFails = () => {
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
    {buttonName: 'Attack', buttonIcon: attackIcon, buttonFunction: onAttack},
    {buttonName: 'Special', buttonIcon: specialIcon, buttonFunction: onSpecial},
    {buttonName: 'Run', buttonIcon: runIcon, buttonFunction: ()=>{setPlayerRunning(true); escapeFunction(setPlayerRunning)}},
    {buttonName: 'Go Back', buttonIcon: backIcon, buttonFunction: ()=>{
      onActivityChange('pet');
      setCurrentlyBusy(false);
      if (currentHealth === 0) {
        setCurrentHealth(1);
        setCurrentEnergy(1);
      }
    }}
  ];

  const fishingButtonList = [
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: 'Go Back', buttonIcon: backIcon, buttonFunction: ()=>{
      onActivityChange('pet');
      setFishingComplete(false);
      setFishingInput(0);
      setCurrentlyBusy(false);
    }},
    {buttonName: 'Fish', buttonIcon: hookIcon, buttonFunction: ()=>{setFishingInput(input => input + 1);}},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
  ];

  const raceButtonList = raceComplete ? [
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: 'Return', buttonIcon: backIcon, buttonFunction: ()=>{
      onActivityChange('pet');
      setRaceComplete(false);
      setSprintActive(false);
      setCurrentlyBusy(false);
    }},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
  ] : [
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: 'Steer Left', buttonIcon: backIcon, buttonFunction: ()=>setRaceSteeringInput((input) => ({ direction: -1, sequence: input.sequence + 1 }))},
    {buttonName: sprintActive ? 'Stop Sprint' : 'Sprint', buttonIcon: runIcon, buttonFunction: ()=>setSprintActive((active) => !active)},
    {buttonName: 'Steer Right', buttonIcon: backIcon, buttonFunction: ()=>setRaceSteeringInput((input) => ({ direction: 1, sequence: input.sequence + 1 }))},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
  ];

  const raceSelectionButtonList = [
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: 'Go Back', buttonIcon: backIcon, buttonFunction: ()=>{
      onActivityChange('pet');
      setCurrentlyBusy(false);
    }},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
  ];

  const battleSelectionButtonList = [
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: 'Go Back', buttonIcon: backIcon, buttonFunction: ()=>{
      onActivityChange('pet');
      setCurrentlyBusy(false);
    }},
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
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
    {buttonName: '', buttonIcon: null, buttonFunction: ()=>{}},
    {buttonName: 'Fishing', buttonIcon: oneIcon, buttonFunction: ()=>{setOptionSelected(1); setPlayOpen(false); setFishingComplete(false); setFishingInput(0); onActivityChange('fishing'); setQuestionWindowOpen(false); setIsLoading(true);}},
    {buttonName: 'Race', buttonIcon: twoIcon, buttonFunction: ()=>{
      setOptionSelected(2);
      setPlayOpen(false);
      setQuestionWindowOpen(false);
      onActivityChange('race-selection');
      setRaceComplete(false);
      setSprintActive(false);
    }},
    {buttonName: 'Battle', buttonIcon: threeIcon, buttonFunction: ()=>{setOptionSelected(3); setPlayOpen(false); setQuestionWindowOpen(false); onActivityChange('battle-selection');}},
    {buttonName: 'Go Back', buttonIcon: backIcon, buttonFunction: ()=>{setPlayOpen(false); setCurrentlyBusy(false); setQuestionWindowOpen(false);}},
  ];

  return (
    <div id='Menu'>
      {
        // Normal Menu Options
        activity === 'pet' && !questionWindowOpen && !showMenuScreen && (
        <>
          {
            normalButtonList.map((button, index) => (
              <span key={index} className={`normal-button-${index} ${(
                (currentlyBusy && index < 4) ||
                !welcomeFormHidden ||
                (index === 0 && currentHunger === 0) ||
                (index === 1 && currentEnergy < MIN_TRAINING_ENERGY) ||
                (index === 2 && currentEnergy < MIN_PLAY_ENERGY) ||
                (index === 3 && sleepButtonDisabled()) ||
                (index !== 0 && index !== 4 && currentHunger === 100)
              ) ? 'disabled' : ''}`}>
                <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName} />
              </span>
            ))
          }
        </>
        )
      }

      {
        activity === 'battle-selection' &&
        <>
          {
            battleSelectionButtonList.map((button, index) => (
              <span key={index} className={`normal-button-${index} ${index === 2 ? '' : 'disabled'}`}>
                <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName || 'Inactive'} />
              </span>
            ))
          }
        </>
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
                  <span key={index} className={`normal-button-${index} ${(button.buttonIcon ? '' : 'disabled')} ${(index === 2 || index === 3) && currentEnergy < MIN_TRAINING_ENERGY ? 'disabled' : ''}`}>
                    <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName || 'Inactive'} />
                  </span>
                ))
              }
            </>
          }
        </>
      }

      {
        activity === 'battle' &&
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
        activity === 'fishing' &&
        <>
          {
            fishingButtonList.map((button, index) => (
              <span key={index} className={`normal-button-${index} ${(!fishingComplete && index === 2) || (fishingComplete && index === 1) ? '' : 'disabled'} ${!isLoading ? '' : 'disabled'}`}>
                <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName || 'Inactive'} />
              </span>
            ))
          }
        </>
      }

      {
        activity === 'race-selection' &&
        <>
          {
            raceSelectionButtonList.map((button, index) => (
              <span key={index} className={`normal-button-${index} ${button.buttonIcon ? '' : 'disabled'}`}>
                <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName || 'Inactive'} />
              </span>
            ))
          }
        </>
      }

      {
        activity === 'race' &&
        <>
          {
            raceButtonList.map((button, index) => (
              <span key={index} className={`normal-button-${index} ${button.buttonIcon ? '' : 'disabled'} ${index === 3 && !raceComplete ? 'race-steer-right' : ''} ${index === 2 && sprintActive && !raceComplete ? 'race-sprint-active' : ''}`}>
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