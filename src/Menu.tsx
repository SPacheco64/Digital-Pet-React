import React from 'react';
import { MenuProps } from './types';

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  // Destructure props for ease of access & documentation
  const {

  } = props;

  return (
    <div id='Menu'>
      {/* Menu content will go here */}
      <span>Oh wow I am a menu</span>
    </div>
  );
};

export default Menu;