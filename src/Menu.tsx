import React, { useState } from 'react';
import { MenuProps } from './types';
import '../styles/components/menu.scss';
import MenuOption from './helpers/MenuOption';

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  // Destructure props for ease of access & documentation
  const {
    inCombat,
    setInCombat,
    setCurrentStatus,
  } = props;

  const [specialsOpen, setSpecialsOpen] = useState<boolean>(false);

  return (
    <div id='Menu'>
      {
        // Normal Menu Options
        !inCombat && (
        <>
          <MenuOption onClick={() => setCurrentStatus('Eating')} optionName='Feed' />
          <MenuOption onClick={() => console.log('Train option clicked')} optionName='Train' />
          <MenuOption onClick={() => console.log('Play option clicked')} optionName='Play' />
          <MenuOption onClick={() => console.log('Sleep option clicked')} optionName='Sleep' />
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