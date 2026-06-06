import React from 'react';

interface MenuOptionProps {
  onClick: () => void;
  optionName: string;
}

const MenuOption: React.FC<MenuOptionProps> = ({ onClick, optionName }) => {
  return (
    <div className='menu-option'>
      <button onClick={onClick} className='menu-btn'>
        {optionName}
      </button>
    </div>
  );
};

export default MenuOption;
