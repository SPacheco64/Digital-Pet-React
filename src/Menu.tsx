import React, { useState } from 'react';
import { MenuProps } from './types';
import '../styles/components/menu.scss';
import MenuOption from './helpers/components/MenuOption';
import feedIcon from './graphics/icons/game_buttons/normal/feed.svg';
import trainIcon from './graphics/icons/game_buttons/normal/train.svg';
import playIcon from './graphics/icons/game_buttons/normal/play.svg';
import sleepIcon from './graphics/icons/game_buttons/normal/sleep.svg';
import statusIcon from './graphics/icons/game_buttons/normal/status.svg';
import backIcon from './graphics/icons/game_buttons/normal/back.svg';
import emptyIcon from './graphics/icons/game_buttons/normal/empty.svg';
import oneIcon from './graphics/icons/game_buttons/normal/one.svg';
import twoIcon from './graphics/icons/game_buttons/normal/two.svg';
import threeIcon from './graphics/icons/game_buttons/normal/three.svg';
import fourIcon from './graphics/icons/game_buttons/normal/four.svg';
import QuestionWindow from './helpers/components/QuestionWindow';

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  // Destructure props for ease of access & documentation
  const {
    inCombat,
    currentStatus,
    showStatusWindow,
    currentlyBusy,
    questionWindowOpen,
    setCurrentlyBusy,
    setInCombat,
    setCurrentStatus,
    setShowStatusWindow,
    setOptionSelected,
    setQuestionWindowOpen,
    setCurrentQuestionType,
  } = props;

  const [specialsOpen, setSpecialsOpen] = useState<boolean>(false);
  const [trainingOpen, setTrainingOpen] = useState<boolean>(false);
  const [playOpen, setPlayOpen] = useState<boolean>(false);
  
  const normalButtonList = [
    {buttonName: 'Feed', buttonIcon: feedIcon, buttonFunction: ()=>{setCurrentStatus('eating'); setCurrentlyBusy(true);}},
    {buttonName: 'Train', buttonIcon: trainIcon, buttonFunction: ()=>{setCurrentlyBusy(true); setTrainingOpen(true); setQuestionWindowOpen(true); setCurrentQuestionType('training');}},
    {buttonName: 'Play', buttonIcon: playIcon, buttonFunction: ()=>{setCurrentlyBusy(true); setPlayOpen(true); setQuestionWindowOpen(true); setCurrentQuestionType('play');}},
    {buttonName: 'Sleep', buttonIcon: sleepIcon, buttonFunction: ()=>{setCurrentStatus('sleeping'); setCurrentlyBusy(true);}},
    {buttonName: 'Status', buttonIcon: (showStatusWindow ? backIcon : statusIcon), buttonFunction: ()=>{setShowStatusWindow(!showStatusWindow);}},
  ];

  const combatButtonList = [
    {buttonName: 'Attack', buttonIcon: '', buttonFunction: ()=>{}},
    {buttonName: 'Special', buttonIcon: '', buttonFunction: ()=>{}},
    {buttonName: 'Run', buttonIcon: '', buttonFunction: ()=>{}},
  ];

  const trainingQuestionButtonList = [
    {buttonName: 'Strength', buttonIcon: oneIcon, buttonFunction: ()=>{setOptionSelected(1); setQuestionWindowOpen(false);}},
    {buttonName: 'Defense', buttonIcon: twoIcon, buttonFunction: ()=>{setOptionSelected(2); setQuestionWindowOpen(false);}},
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
        !inCombat && !questionWindowOpen && (
        <>
          {
            normalButtonList.map((button, index) => (
              <span className={`normal-button-${index} ${(currentlyBusy && index < 4) ? 'disabled' : ''}`}>
                <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName} />
              </span>
            ))
          }
        </>
        )
      }

      {
        questionWindowOpen &&
        <>
          {
            trainingOpen && 
            <>
              <span className='normal-button-0 disabled'>
                <MenuOption onClick={()=>{}} icon={emptyIcon} optionName={''} />
              </span>
              {
                trainingQuestionButtonList.map((button, index) => (
                  <span className={`normal-button-${index+1}`}>
                    <MenuOption onClick={button.buttonFunction} icon={button.buttonIcon} optionName={button.buttonName} />
                  </span>
                ))
              }
              <span className='normal-button-4 disabled'>
                <MenuOption onClick={()=>{}} icon={emptyIcon} optionName={''} />
              </span>
            </>
          }

          {
            playOpen && 
            <>
              {
                playQuestionButtonList.map((button, index) => (
                  <span className={`normal-button-${index}`}>
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