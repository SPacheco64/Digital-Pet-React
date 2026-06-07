import React, { useState } from 'react';
import { MenuProps } from './types';
import '../styles/components/menu.scss';
import MenuOption from './helpers/MenuOption';

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

  return (
    <div id='Menu'>
      {
        // Normal Menu Options
        !inCombat && (
        <>
          <span className={currentStatus === 'Egg' ? 'disabled' : ''}>
            <MenuOption onClick={() => setCurrentStatus('eating')} optionName='Feed' />
          </span>
          <span className='disabled'>
            <MenuOption onClick={() => console.log('Train option clicked')} optionName='Train' />
          </span>
          <span className='disabled'>
            <MenuOption onClick={() => console.log('Play option clicked')} optionName='Play' />
          </span>
          <span className='disabled'>
            <MenuOption onClick={() => console.log('Sleep option clicked')} optionName='Sleep' />
          </span>
          {
            showStatusWindow && <MenuOption onClick={() => setShowStatusWindow(false)} optionName='Go Back' />
          }
          {
            !showStatusWindow && <MenuOption onClick={() => setShowStatusWindow(true)} optionName='Status' />
          }
          {/* <MenuOption onClick={() => setInCombat(true)} optionName='Fight' /> */}
        </>
        )
      }
      {
        // Combat Menu Options
        inCombat && !specialsOpen && (
          <>
            <MenuOption onClick={() => console.log('Attack option clicked')} optionName='Attack' />
            <MenuOption onClick={() => setSpecialsOpen(true)} optionName='Special' />
            <MenuOption onClick={() => setInCombat(false)} optionName='Run' />
          </>
        )
      }
      {
        // Special Action Menu Options
        inCombat && specialsOpen && (
          <>
            <MenuOption onClick={() => console.log('Special 1 option clicked')} optionName='Special 1' />
            <MenuOption onClick={() => console.log('Special 2 option clicked')} optionName='Special 2' />
            <MenuOption onClick={() => setSpecialsOpen(false)} optionName='Back' />
          </>
        )
      }
    </div>
  );
};

export default Menu;